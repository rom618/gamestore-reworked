// ─────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────

export enum CardType {
  Visa = "Visa",
  Mastercard = "Mastercard",
  Interact = "Interact",
  AmericanExpress = "AmericanExpress",
}

export enum Category {
  Horror = "Horror",
  Puzzle = "Puzzle",
  Action = "Action",
  ActionAdventure = "ActionAdventure",
  Sports = "Sports",
  Strategy = "Strategy",
  RPG = "RPG",
  Multiplayer = "Multiplayer",
  Simulation = "Simulation",
  Survival = "Survival",
  Party = "Party",
  Shooter = "Shooter",
  Casual = "Casual",
  Platformer = "Platformer",
  BattleRoyale = "BattleRoyale",
  Sandbox = "Sandbox",
  MMO = "MMO",
}

export enum GameConsole {
  PS4 = "PS4",
  PS5 = "PS5",
  WiiU = "WiiU",
  NintendoSwitch = "NintendoSwitch",
  PC = "PC",
  XBoxSeriesS = "XBoxSeriesS",
  XBoxSeriesX = "XBoxSeriesX",
  Mac = "Mac",
}

// ─────────────────────────────────────────────
// Accounts
// ─────────────────────────────────────────────

export interface Account {
  id: number;
  username: string;
  passwordHash?: string;
  randomPassword?: string;
}

export interface CustomerAccount extends Account {
  emailAddress: string;
  name?: string; // lazy
  wishlist?: Wishlist;
  paymentInformation?: PaymentInformation[];
  reviews?: Review[];
  transactions?: Transaction[];
}

export interface StaffAccount extends Account {}

export interface ManagerAccount extends StaffAccount {
  username: "admin";
}

export interface EmployeeAccount extends StaffAccount {}

// ─────────────────────────────────────────────
// Cart
// ─────────────────────────────────────────────

export interface Cart {
  id: number;
  customerAccount: CustomerAccount;
  gameQtys: GameQty[];
  transaction?: Transaction;
}

// ─────────────────────────────────────────────
// Wishlist
// ─────────────────────────────────────────────

export interface Wishlist {
  id: number;
}

// ─────────────────────────────────────────────
// Catalog
// ─────────────────────────────────────────────

export interface Catalog {
  id: number;
  games?: Game[];
}

// ─────────────────────────────────────────────
// Address
// ─────────────────────────────────────────────

export interface Address {
  id: number;
  address: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
}

// ─────────────────────────────────────────────
// Payment
// ─────────────────────────────────────────────

export interface PaymentInformation {
  id: number;
  cardholderName: string;
  cardNumber: number;
  expirationDate: string; // ISO date string
  cvc: number;
  cardType: CardType;
}

// ─────────────────────────────────────────────
// Transaction
// ─────────────────────────────────────────────

export interface Transaction {
  transactionId: number;
  totalPrice: number;
  isPaid: boolean;
  deliveryStatus: boolean;
  promotionCode?: string;
  userAgreementCheck: boolean;
  paymentInformation: PaymentInformation;
}

// ─────────────────────────────────────────────
// Review
// ─────────────────────────────────────────────

export interface Review {
  id: number;
  date: string; // ISO date string
  description: string;
  likeCount: number;
  dislikeCount: number;
  rating: number;
  employeeReviewed: boolean;
  replies?: Review[];
}

// ─────────────────────────────────────────────
// Game
// ─────────────────────────────────────────────

export interface Game {
  id: number;
  name: string;
  price: number;
  description: string;
  category: Category;
  gameConsole: GameConsole;
  gameQtys?: GameQty[];
  reviews?: Review[];
}

// ─────────────────────────────────────────────
// GameQty
// ─────────────────────────────────────────────

export interface GameQty {
  id: number;
  qty: number;
}

// ─────────────────────────────────────────────
// Promotion Code
// ─────────────────────────────────────────────

export interface PromotionCode {
  id: number;
  code: string;
  percentageValue: number;
}

// ─────────────────────────────────────────────
// Game Store Application
// ─────────────────────────────────────────────

export interface GameStoreApplication {
  id: number;
  policy?: string;
  promotionCodes: PromotionCode[];
}

// ─────────────────────────────────────────────
// API Request / Response helpers
// ─────────────────────────────────────────────

export interface CreateCustomerAccountRequest {
  username: string;
  password: string;
  emailAddress: string;
  name?: string;
}

export interface CreateStaffAccountRequest {
  username: string;
  password: string;
  role: "manager" | "employee";
}

export interface CreateGameRequest {
  name: string;
  price: number;
  description: string;
  category: Category;
  gameConsole: GameConsole;
}

export interface CreateTransactionRequest {
  totalPrice: number;
  isPaid: boolean;
  deliveryStatus: boolean;
  promotionCode?: string;
  userAgreementCheck: boolean;
  paymentInformationId: number;
}

export interface CreateReviewRequest {
  description: string;
  rating: number;
  gameId: number;
  customerId: number;
}

export interface CreateAddressRequest {
  address: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  customerAccountId: number;
}

export interface CreatePaymentInformationRequest {
  cardholderName: string;
  cardNumber: number;
  expirationDate: string;
  cvc: number;
  cardType: CardType;
  customerAccountId: number;
}

export interface CreateGameQtyRequest {
  qty: number;
  gameId: number;
}

export interface UpdateGameQtyRequest {
  id: number;
  qty: number;
}

export interface CreatePromotionCodeRequest {
  code: string;
  percentageValue: number;
}