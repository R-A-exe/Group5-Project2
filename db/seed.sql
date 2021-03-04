INSERT INTO Users (email, password, createdAt, updatedAt) VALUES ("first_user@gmail.com", "firstuserpassword", "2021-01-01 00:00:00", "2021-01-01 00:00:00");
INSERT INTO Users (email, password, createdAt, updatedAt) VALUES ("second_user@gmail.com", "seconduserpassword", "2021-01-01 00:00:00", "2021-01-01 00:00:00");
INSERT INTO Users (email, password, createdAt, updatedAt) VALUES ("third_user@gmail.com", "thirduserpassword", "2021-01-01 00:00:00", "2021-01-01 00:00:00");

INSERT INTO Wallets (title, category, public, ownerId, createdAt, updatedAt) VALUES ("My first wallet", "Groceries, Gas, Hydro, Internet", true, (SELECT id FROM users WHERE email = "first_user@gmail.com"), "2021-01-01 00:00:00", "2021-01-01 00:00:00");

INSERT INTO wallet_user (UserId, WalletId, createdAt, updatedAt) VALUES ((SELECT id FROM users WHERE email = "first_user@gmail.com"), (SELECT id FROM Wallets WHERE title = "My first wallet"), "2021-01-01 00:00:00", "2021-01-01 00:00:00");
INSERT INTO wallet_user (UserId, WalletId, createdAt, updatedAt) VALUES ((SELECT id FROM users WHERE email = "second_user@gmail.com"), (SELECT id FROM Wallets WHERE title = "My first wallet"), "2021-01-01 00:00:00", "2021-01-01 00:00:00");
INSERT INTO wallet_user (UserId, WalletId, createdAt, updatedAt) VALUES ((SELECT id FROM users WHERE email = "third_user@gmail.com"), (SELECT id FROM Wallets WHERE title = "My first wallet"), "2021-01-01 00:00:00", "2021-01-01 00:00:00");

INSERT INTO Expenses (amount, title, description, category, date, paidById, WalletId, createdAt, updatedAt) VALUES (50, "Metro groceries", "Bought a bunch of food", "Groceries", "2020-03-01", 1, 1, "2021-01-01 00:00:00", "2021-01-01 00:00:00");
INSERT INTO Splits (share, ExpenseId, UserId, createdAt, updatedAt) VALUES (0.33, (SELECT LAST_INSERT_ID()), 1, "2021-01-01 00:00:00", "2021-01-01 00:00:00"),
(0.33, (SELECT LAST_INSERT_ID()), 2, "2021-01-01 00:00:00", "2021-01-01 00:00:00"),
(0.33, (SELECT LAST_INSERT_ID()), 3, "2021-01-01 00:00:00", "2021-01-01 00:00:00");

INSERT INTO Expenses (amount, title, description, category, date, paidById, WalletId, createdAt, updatedAt) VALUES (40, "Gas", "Filled up the car", "Gas", "2020-02-015", 2, 1, "2021-01-01 00:00:00", "2021-01-01 00:00:00");
INSERT INTO Splits (share, ExpenseId, UserId, createdAt, updatedAt) VALUES (0.25, (SELECT LAST_INSERT_ID()), 1, "2021-01-01 00:00:00", "2021-01-01 00:00:00"),
(0.25, (SELECT LAST_INSERT_ID()), 2, "2021-01-01 00:00:00", "2021-01-01 00:00:00"),
(0.5, (SELECT LAST_INSERT_ID()), 3, "2021-01-01 00:00:00", "2021-01-01 00:00:00");

INSERT INTO Expenses (amount, title, description, category, date, paidById, WalletId, createdAt, updatedAt) VALUES (100, "Hydro", "Paid the hydro bill", "Hyrdo", "2020-02-28", 3, 1, "2021-01-01 00:00:00", "2021-01-01 00:00:00");
INSERT INTO Splits (share, ExpenseId, UserId, createdAt, updatedAt) VALUES (1, (SELECT LAST_INSERT_ID()), 1, "2021-01-01 00:00:00", "2021-01-01 00:00:00"),
(0, (SELECT LAST_INSERT_ID()), 2, "2021-01-01 00:00:00", "2021-01-01 00:00:00"),
(0, (SELECT LAST_INSERT_ID()), 3, "2021-01-01 00:00:00", "2021-01-01 00:00:00");

INSERT INTO Expenses (amount, title, description, category, date, paidById, WalletId, createdAt, updatedAt) VALUES (80, "Internet", "Paid the internet bill", "Internet", "2020-03-01", 1, 1, "2021-01-01 00:00:00", "2021-01-01 00:00:00");
INSERT INTO Splits (share, ExpenseId, UserId, createdAt, updatedAt) VALUES (0.5, (SELECT LAST_INSERT_ID()), 1, "2021-01-01 00:00:00", "2021-01-01 00:00:00"),
(0.5, (SELECT LAST_INSERT_ID()), 2, "2021-01-01 00:00:00", "2021-01-01 00:00:00"),
(0, (SELECT LAST_INSERT_ID()), 3, "2021-01-01 00:00:00", "2021-01-01 00:00:00");

