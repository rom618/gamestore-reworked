#Game Store API Documentation
##Base URLs

Customer Account: /api/customer-account

Staff Account: /api/staff-account

Address: /addresses

Game: /api/games

GameQty: /api/game_qty

GameStoreObject: /api/game-store-object

PaymentInformation: /api/payment-information

PromotionCode: /promotion-code

Review: /reviews

Transaction: /api/transaction

| Method | Endpoint                                               | Description                             |
| ------ | ------------------------------------------------------ | --------------------------------------- |
| GET    | `/get-with-id/{id}`                                    | Retrieve a customer account by ID       |
| GET    | `/get-with-email/{email}`                              | Retrieve a customer account by email    |
| GET    | `/get-with-username/{username}`                        | Retrieve a customer account by username |
| GET    | `/get/all`                                             | Retrieve all customer accounts          |
| POST   | `/create`                                              | Create a new customer account           |
| PUT    | `/update-username/{email}/{username}`                  | Update username                         |
| PUT    | `/update-password/{email}/{oldPassword}/{newPassword}` | Update password                         |
| PUT    | `/update-name/{email}/{name}`                          | Update name                             |
| DELETE | `/delete/{id}`                                         | Delete account by ID                    |
| GET    | `/testing`                                             | Test endpoint                           |

| Method | Endpoint                                                  | Description                        |
| ------ | --------------------------------------------------------- | ---------------------------------- |
| GET    | `/get-with-id/{id}`                                       | Retrieve a staff account by ID     |
| GET    | `/get-with-username/{username}`                           | Retrieve staff account by username |
| GET    | `/get/all`                                                | Retrieve all staff accounts        |
| POST   | `/create`                                                 | Create a new staff account         |
| PUT    | `/update-password/{username}/{oldPassword}/{newPassword}` | Update password                    |
| DELETE | `/delete/{id}`                                            | Delete staff account by ID         |

| Method | Endpoint                 | Description           |
| ------ | ------------------------ | --------------------- |
| POST   | `/addresses`             | Create a new address  |
| GET    | `/addresses`             | Get all addresses     |
| GET    | `/addresses/{id}`        | Get address by ID     |
| PUT    | `/addresses/{id}`        | Update address by ID  |
| DELETE | `/addresses/{id}`        | Delete address        |
| GET    | `/addresses/city/{city}` | Get addresses by city |

| Method | Endpoint                  | Description       |
| ------ | ------------------------- | ----------------- |
| POST   | `/api/games/new-game`     | Create a new game |
| GET    | `/api/games/get/{id}`     | Get a game by ID  |
| PUT    | `/api/games/update/{id}`  | Update game by ID |
| DELETE | `/api/games/delete/{id}`  | Delete game by ID |
| GET    | `/api/games/get/allgames` | Get all games     |

| Method | Endpoint                                | Description                        |
| ------ | --------------------------------------- | ---------------------------------- |
| GET    | `/api/game_qty/get/{id}`                | Get GameQty by ID                  |
| GET    | `/api/game_qty/get_by_transaction/{id}` | Get all GameQtys for a transaction |
| POST   | `/api/game_qty/create`                  | Create new GameQty                 |
| PUT    | `/api/game_qty/update`                  | Update GameQty                     |
| DELETE | `/api/game_qty/delete/{id}`             | Delete GameQty                     |

| Method | Endpoint                             | Description               |
| ------ | ------------------------------------ | ------------------------- |
| POST   | `/api/game-store-object/create`      | Create GameStoreObject    |
| GET    | `/api/game-store-object/{id}`        | Get GameStoreObject by ID |
| PUT    | `/api/game-store-object/update/{id}` | Update GameStoreObject    |
| DELETE | `/api/game-store-object/delete/{id}` | Delete GameStoreObject    |

| Method | Endpoint                                                               | Description                             |
| ------ | ---------------------------------------------------------------------- | --------------------------------------- |
| GET    | `/api/payment-information/get/{id}`                                    | Get PaymentInformation by ID            |
| GET    | `/api/payment-information/get-by-customer-account/{customerAccountId}` | Get all PaymentInformation for customer |
| POST   | `/api/payment-information/create`                                      | Create PaymentInformation               |
| PUT    | `/api/payment-information/update/{id}`                                 | Update PaymentInformation               |
| DELETE | `/api/payment-information/delete/{id}`                                 | Delete PaymentInformation               |

| Method | Endpoint                      | Description              |
| ------ | ----------------------------- | ------------------------ |
| POST   | `/promotion-code/create`      | Create promotion code    |
| GET    | `/promotion-code/{id}`        | Get promotion code by ID |
| DELETE | `/promotion-code/delete/{id}` | Delete promotion code    |

| Method | Endpoint                         | Description                   |
| ------ | -------------------------------- | ----------------------------- |
| POST   | `/reviews`                       | Create a review               |
| GET    | `/reviews/{id}`                  | Get review by ID              |
| GET    | `/reviews/game/{gameId}`         | Get all reviews for a game    |
| GET    | `/reviews/customer/{customerId}` | Get all reviews by a customer |
| PUT    | `/reviews/{id}/update`           | Update like/dislike counts    |
| DELETE | `/reviews/{id}`                  | Delete review                 |

| Method | Endpoint                                        | Description                         |
| ------ | ----------------------------------------------- | ----------------------------------- |
| GET    | `/api/transaction/get/{id}`                     | Get transaction by ID               |
| GET    | `/api/transaction/get-by-customer/{customerId}` | Get all transactions for a customer |
| POST   | `/api/transaction/create`                       | Create transaction                  |
| PUT    | `/api/transaction/update/{id}`                  | Update transaction                  |
| DELETE | `/api/transaction/delete/{id}`                  | Delete transaction                  |

| Method | Endpoint                                        | Description                         |
| ------ | ----------------------------------------------- | ----------------------------------- |
| GET    | `/api/transaction/get/{id}`                     | Get transaction by ID               |
| GET    | `/api/transaction/get-by-customer/{customerId}` | Get all transactions for a customer |
| POST   | `/api/transaction/create`                       | Create transaction                  |
| PUT    | `/api/transaction/update/{id}`                  | Update transaction                  |
| DELETE | `/api/transaction/delete/{id}`                  | Delete transaction                  |
