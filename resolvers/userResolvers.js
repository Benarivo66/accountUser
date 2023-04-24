const axios = require("axios");
const { get } = require("fast-levenshtein");
const fs = require("fs");
const path = require("path");

const jsonFilePath = path.join(__dirname, "..", "database", "/user.json");

const resolvers = {
  Query: {
    async getAccountName(_, { accountNumber, bankCode }) {
      const jsonData = fs.readFileSync(jsonFilePath);

      const users = JSON.parse(jsonData);
      const user = users.find((u) => u.id === bankCode + accountNumber);
      if (user && user.name) {
        return user.name;
      }

      try {
        const response = await axios.get(
          `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
          }
        );

        const paystackName = response.data.data.account_name;

        return paystackName;
      } catch (error) {
        throw new Error("Invalid bank code or account number");
      }
    },
  },
  Mutation: {
    async verifyUser(_, userParams) {
      const { accountNumber, bankCode, accountName } = userParams;

      try {
        const response = await axios.get(
          `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const paystackName = response.data.data.account_name;

        const distance = get(
          accountName.toLowerCase(),
          paystackName.toLowerCase()
        );

        const isVerified = distance <= 2;
        const user = {
          id: bankCode + accountNumber,
          name: accountName,
          isVerified,
        };

        const users = JSON.parse(fs.readFileSync(jsonFilePath));

        const existingUser = users.find(
          (u) => u.id === bankCode + accountNumber
        );
        if (!existingUser) {
          users.push(user);
          fs.writeFileSync(jsonFilePath, JSON.stringify(users));
        } else if (
          existingUser &&
          !existingUser.isVerified &&
          user.isVerified
        ) {
          let ind = users.findIndex((u) => u.id === bankCode + accountNumber);
          users[ind] = user;
          fs.writeFileSync(jsonFilePath, JSON.stringify(users));
        }

        return user;
      } catch (error) {
        throw new Error("Invalid bank code or account number");
      }
    },
  },
};

module.exports = resolvers;
