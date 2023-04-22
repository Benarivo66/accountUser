const axios = require("axios");
const fs = require("fs");
const path = require("path");

const resolvers = require("../resolvers/userResolvers");
const jsonFilePath = path.join(__dirname, "..", "database", "/user.json");

jest.mock("axios");

describe("resolvers", () => {
    
    beforeEach(() => {
        fs.writeFileSync(
            jsonFilePath,
            JSON.stringify([])
          );
    });

  describe("Query.getAccountName", () => {
    it("should return user name from json file", async () => {
      const jsonData = JSON.stringify([{ id: "1231234567890", name: "John Doe" }]);
      fs.readFileSync = jest.fn().mockReturnValue(jsonData);
      const result = await resolvers.Query.getAccountName(null, {
        accountNumber: "1234567890",
        bankCode: "123",
      });
      expect(result).toBe("John Doe");
    });

    it("should return account name from paystack api", async () => {
      const responseData = {
        data: {
          data: {
            account_name: "John Doe",
          },
        },
      };
      axios.get.mockResolvedValue(responseData);
      const result = await resolvers.Query.getAccountName(null, {
        accountNumber: "1234567890",
        bankCode: "123",
      });
      expect(result).toBe("John Doe");
    });

    it("should throw an error for invalid bank code or account number", async () => {
      const responseData = {
        data: {
          data: {},
        },
      };
      axios.get.mockResolvedValue(responseData);
      await expect(
        resolvers.Query.getAccountName(null, {
          accountNumber: "1234567890",
          bankCode: "99",
        })
      ).rejects.toThrow("Invalid bank code or account number");
    });

    it("should throw an error for invalid response from paystack api", async () => {
      axios.get.mockResolvedValue(null);
      await expect(
        resolvers.Query.getAccountName(null, {
          accountNumber: "1234567890",
          bankCode: "77",
        })
      ).rejects.toThrow(
        "Please ensure your account number,bank code and paystack secret keys are valid"
      );
    });
  });

  describe("Mutation.verifyUser", () => {
    it("should verify user and return the user object", async () => {
      const responseData = {
        data: {
          data: {
            account_name: "John Doe",
          },
        },
      };
      axios.get.mockResolvedValue(responseData);
      const result = await resolvers.Mutation.verifyUser(null, {
        accountNumber: "1234567890",
        bankCode: "123",
        accountName: "John Doe",
      });
      expect(result).toEqual({
        id: "1231234567890",
        name: "John Doe",
        isVerified: true,
      });
    });

    it("should throw an error for invalid bank code or account number", async () => {
      const responseData = {
        data: {
          data: {},
        },
      };
      axios.get.mockResolvedValue(responseData);
      await expect(
        resolvers.Mutation.verifyUser(null, {
          accountNumber: "0123456789",
          bankCode: "66",
          accountName: "John Doe",
        })
      ).rejects.toThrow("Invalid bank code or account number");
    });

    it("should throw an error for invalid response from paystack api", async () => {
      axios.get.mockResolvedValue(null);
      await expect(
        resolvers.Mutation.verifyUser(null, {
          accountNumber: "1234567890",
          bankCode: "55",
          accountName: "John Doe",
        })
      ).rejects.toThrow(
        "Please ensure your account number,bank code and paystack secret key are valid"
      );
    });
  });
});
