export enum EUserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
  STAFF = 'staff',
  PHARMACIST = 'pharmacist',
  ACCOUNTANT = 'accountant',
}

export enum EUserGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum EAppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  CHECKED_IN = 'checked_in',
  NO_SHOW = 'no_show',
  IN_PROGRESS = 'in_progress',
}

export enum ESourceAppointment {
  ONLINE = 'online',
  WALK_IN = 'walkIn',
}

export enum EPaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum EPaymentMethod {
  CASH_ON_DELIVERY = 'cash_on_delivery',
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
}

export enum ERoomType {
  EXAMINATION = 'examination',
  EMERGENCY = 'emergency',
  OPERATING = 'operating',
  INTENSIVE_CARE = 'intensive_care',
  RECOVERY = 'recovery',
  PATIENT_WARD = 'patient_ward',
  ISOLATION = 'isolation',
  MATERNITY = 'maternity',
  PEDIATRIC = 'pediatric',
  LABORATORY = 'laboratory',
  RADIOLOGY = 'radiology',
  PHARMACY = 'pharmacy',
  CONSULTATION = 'consultation',
  WAITING = 'waiting',
  STAFF = 'staff',
  OFFICE = 'office',
}

export enum ELoginMethod {
  EMAIL = 'email',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

export enum ELoginStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  BLOCKED = 'blocked',
}

export enum EInvoiceStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export enum EDepartmentType {
  CLINICAL = 'clinical',
  PARACLINICAL = 'paraclinical',
  ADMINISTRATIVE = 'administrative',
}

export enum EAppointmentType {
  NEW = 'new',
  FOLLOW_UP = 'followUp',
  CHECK_UP = 'checkUp',
  CONSULTATION = 'consultation',
  TELEHEALTH = 'telehealth',
}

export enum ERoomStatus {
  NOT_USED = 'not_used',
  USED = 'used',
  MAINTENANCE = 'maintenance',
}

export enum EScheduleType {
  APPOINTMENT = 'appointment',
  WORK = 'work',
  SURGERY = 'surgery',
  DUTY = 'duty',
  ADMIN = 'admin',
  OFF = 'off',
}

export enum EScheduleStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum MedicineStatus {
  AVAILABLE = 'available',
  OUT_OF_STOCK = 'out_of_stock',
}

export enum EBedStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
}

// ===============================
// CORE MODELS
// ===============================
export interface IRole {
  id: string;
  name: EUserRole;
  prefix: string;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  citizen_id?: string;
  password?: string | null;
  avatar: string;
  roleId: number;
  role: IRole;
  birthday?: string | null;
  gender: EUserGender;
  phone?: string | null;
  addressId?: string | null;
  nameId?: string | null;
  authentication?: IAuthentication;
  createdAt: string;
  updatedAt: string;
  address?: IAddress;
  sessions?: ISession[];
  name: IName | null;
  staff?: IStaff;
  patient?: IPatient;
}

export interface ILoginResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

interface IAuthentication {
  userId: string;
  googleId?: string;
  facebookId?: string;
  lastLogin?: string;
  isVerified: boolean;
  createdAt: string;
}
export interface IName {
  userId: string;
  firstName: string;
  lastName: string;
}

export interface IVerficationCode {
  id: string;
  userId?: string;
  email?: string;
  code: string;
  type: string;
  channel: string;
  expiresAt: string;
  createdAt: string;
  used: boolean;
  resendCount: number;
  lastResendAt?: string;
}

export interface IAddress {
  id: string;
  detail: string;
  ward: string;
  district?: string;
  city: string;
  country: string;
  user?: IUser | null;
  hospital?: IHospital | null;
}

export interface ISession {
  id: string;
  userId: string;
  user?: IUser;
  expiresAt: string;
  createdAt: string;
}

// ===============================
// STAFF & MEDICAL MODELS
// ===============================

export interface IStaff {
  userId: string;
  staffId: string;
  departmentId: number;
  position: string;
  joinTime: string;
  leaveTime?: string | null;
  manager?: IManager | null;
  doctor?: IDoctor | null;
  department?: IDepartment | null;
  schedules?: ISchedule[];
  user?: IUser | null;
}

export interface IDoctor {
  userId: string;
  specialization?: string | null;
  licenseNumber?: string | null;
  experienceYears: number | null;
  level?: string | null;
  staff?: IStaff;
  appointment?: IAppointment[];
  name?: IName | null;
  user?: IUser;
  doctorServices?: IDoctorService[];
}

export interface IManager {
  userId: string;
  user?: IStaff;
}

export interface IDepartment {
  id: number;
  name: string;
  description?: string | null;
  code: string;
  phone?: string;
  type: EDepartmentType;
  totalServices?: number;
  thumbnail?: string | null;
  images?: string[] | null;
  maxSlot?: number | null;
  roomId?: string | null;
  headId?: string;
  head?: IStaff;
  staffs?: IStaff[];
  createdAt: string;
  updatedAt: string;
  deputies?: IDepartmentDeputy[];
  room?: IRoom | null;
  medicalServices?: IMedicalService[];
  doctors?: IDoctor[];
}

export interface IDepartmentDeputy {
  id: number;
  departmentId: number;
  userId: string;
  staff?: IStaff | null;
  department?: IDepartment | null;
  appointedAt: string;
  updatedAt: string;
}

// ===============================
// PATIENT & MEDICAL MODELS
// ===============================

export interface IPatient {
  userId: string;
  user?: IUser;
  patientId: string;
  healthInsurances?: IHealthInsurance[];
  appointments?: IAppointment[];
  healthInfo?: IHealthInformation | null;
  invoice?: IInvoice[];
  ehr?: IEHR;
  emergencyContacts?: IEmergencyContact[];
  visits?: IVisit[];
}

export interface IEmergencyContact {
  id: string;
  patientId: string;
  patient?: IPatient;
  fullName: string;
  relationship: string;
  phone: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IHealthInsurance {
  id: string;
  userId: string;
  user?: IPatient;
  type: string;
  insuranceId: string;
  startAt: string;
  endAt: string;
  level_of_benefit?: number;
  createdAt: string;
  updatedAt: string;
  initial_kcb_name?: string;
  initial_kcb_code?: string;
  province_code?: string;
  coverage: number;
}

export interface IEHR {
  id: string;
  patientId: string;
  createdAt: string;
  updatedAt: string;
  patient?: IPatient;
  visits?: IVisit[];
}

export enum EVisitStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface IVisit {
  id: string;
  ehrId: string;
  appointmentId?: string | null;
  medicalServiceId?: string | null;
  doctorId?: string | null;
  status: EVisitStatus;
  startTime: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
  nextVisitDate?: string | null;
  ehr?: IEHR;
  appointment?: IAppointment | null;
  doctor?: IDoctor | null;
  medicalRecords?: IMedicalRecord[];
  prescriptions?: IPrescription[];
  visitServices?: IVisitService[];
  medicalService?: IMedicalService | null;
}

export interface IMedicalRecord {
  id: string;
  visitId: string;
  visit?: IVisit;
  doctorId?: string;
  doctor?: IDoctor;
  title: string;
  symptoms: string;
  diagnosis: string;
  treatments: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  fileAssets?: IFileAsset[];
  isParent: boolean;
}

export enum EEntityType {
  MEDICAL_RECORD = 'medical_record',
  PRESCRIPTION = 'prescription',
  OTTHER = 'other',
}

export interface IFileAsset {
  id: string;
  url: string;
  name?: string;
  size?: string;
  entityType: EEntityType;
  entityId: string;
  fileType: string;
  mimeType: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAppointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduleId?: string;
  bookedByUserId?: string;
  medicalServiceId?: string;
  medicalService?: IMedicalService | null;
  type: EAppointmentType;
  patient?: IPatient;
  doctor?: IDoctor;
  schedule?: ISchedule;
  bookedBy: IUser;
  startTime: string;
  endTime?: string;
  actualStartTime?: string | null;
  reason: string;
  reasonCancel?: string | null;
  notes?: string | null;
  beginAt?: string | null;
  status: EAppointmentStatus;
  createdAt: string;
  updatedAt: string;
  source: ESourceAppointment;
}

export interface IHealthInformation {
  id: string;
  patientId: string;
  weight?: number;
  height?: number;
  bloodType?: string;
  has_high_blood_pressure?: boolean;
  has_diabetes?: boolean;
  has_allergies?: boolean;
  has_cancer?: boolean;
  createdAt?: string;
  updatedAt?: string;
  patient?: IPatient | null;
}

// ===============================
// HOSPITAL & FACILITY MODELS
// ===============================

export interface IHospital {
  id: string;
  name: string;
  addressId?: string | null;
  address?: IAddress | null;
  phone: string;
  createdAt: string;
  updatedAt: string;
  buildings?: IBuilding[];
}

export interface IBuilding {
  id: string;
  hospitalId: string;
  hospital?: IHospital;
  floorCount: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  rooms?: IRoom[];
}

export interface IRoom {
  id: string;
  buildingId: string;
  building?: IBuilding | null;
  department?: IDepartment | null;
  name: string;
  number_room: number;
  floor: number;
  type: ERoomType;
  status: ERoomStatus;
  createdAt: string;
  updatedAt: string;
  schedules?: ISchedule[];
  medicalServices?: IMedicalService[];
}

export interface ISchedule {
  id: string;
  staffId: string;
  departmentId: number;
  staff?: IStaff;
  department?: IDepartment | null;
  roomId: string;
  room?: IRoom;
  type: EScheduleType;
  date: string;
  status: EScheduleStatus;
  maxSlot?: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  appointments?: IAppointment[];
}

// ===============================
// MEDICAL SERVICE & BILLING MODELS
// ===============================

export interface IMedicalService {
  id: string;
  name: string;
  images: string[];
  description?: string | null;
  roomId?: string | null;
  price: number;
  unit?: string;
  durationMinutes?: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  percentApplyHealthInsurance: number;
  departmentId?: string | null;
  department?: IDepartment | null;
  visitServices?: IVisitService[];
  doctorServices?: IDoctorService[];
  appointments?: IAppointment[];
  room?: IRoom;
}

export interface IDoctorService {
  doctorId: string;
  medicalServiceId: string;
  doctor?: IDoctor;
  medicalService?: IMedicalService;
  price?: number;
  durationMinutes?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum EVisitServiceStatus {
  ORDERED = 'ordered',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  CANCELLED = 'cancelled',
}

export interface IVisitService {
  id: string;
  visitId: string;
  medicalServiceId: string;
  orderedByUserId: string;
  orderedBy?: IUser;
  medicalService?: IMedicalService;
  visit?: IVisit;
  status: EVisitServiceStatus;
  orderedAt: string;
  createdAt: string;
  updatedAt: string;
  quantity: number;
  price: number;
}

export interface IInvoice {
  id: string;
  patientId: string;
  patient?: IPatient;
  visitId: string;
  visit?: IVisit;
  healthInsuranceId?: string | null;
  healthInsurance?: IHealthInsurance;
  discountAmount: number;
  discountReason?: string | null;
  taxAmount: number;
  totalAmount: number;
  notes?: string | null;
  issuedByUserId?: string | null;
  issuedBy?: IUser | null;
  createdAt?: string;
  updatedAt?: string;
  status: EInvoiceStatus;
  payments?: IPayment | null;
  invoiceItems?: IInvoiceItem[];
}

export interface IInvoiceItem {
  id: string;
  invoiceId: string;
  item_type: 'service' | 'medicine';
  refId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  detail: IMedicalService | IPrescription | null;
}
export interface IPayment {
  id: string;
  invoiceId?: string | null;
  userName?: string;
  paymentMethod: EPaymentMethod;
  invoice?: IInvoice | null;
  amount: number;
  status: EPaymentStatus;
  createdAt: string;
  updatedAt: string;
}

// ===============================
// MEDICINE MODELS
// ===============================

export interface IMedicine {
  id: string;
  name: string;
  genericName?: string;
  brandName?: string;
  description?: string;
  category?: string;
  form?: string;
  dosage?: string;
  unit?: string;
  price: number;
  manufacturer?: string;
  country?: string;
  sideEffects?: string[];
  interactions?: string[];
  contraindications?: string[];
  storageConditions?: string;
  stock?: number;
  expiryDate?: string;
  status?: MedicineStatus;
  createdAt: string;
  updatedAt: string;
  indications?: string[];
}

export interface IPrescription {
  id: string;
  paid: boolean;
  visitId: string;
  createdAt: string;
  updatedAt: string;
  medicineUsages?: IMedicineUsage[];
  visit?: IVisit;
  createdByUserId?: string;
  createdBy?: IUser;
}

export interface IMedicineUsage {
  id: string;
  prescriptionId: string;
  prescription?: IPrescription;
  medicineId: string;
  medicine?: IMedicine;
  quantity: number;
  duration?: string;
  price: number;
  drugName: string;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  isPurchased: boolean;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  parent?: ICategory | null;
  children?: ICategory[];
  parentId?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export enum EArticleStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  PUBLISHED = 'published',
  REJECTED = 'rejected',
  REEDITED = 'reedited',
}
export interface IHealthArticle {
  id: string;
  title: string;
  content: string;
  summary?: string;
  slug: string;
  imageUrl: string | null;
  images: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  authorId: string;
  categoryId: string;
  author: IUser;
  category: ICategory;
  status: EArticleStatus;
  featured: boolean;
  extras?: Record<string, any>;
  toc?: TocItem[];
  reasonReject?: string;
  assigneeId?: string | null;
  assignee?: IUser;
}

interface TocItem {
  id: string;
  label: string;
  level: number;
}

export interface IConversation {
  id: string;
  userId: string;
  title?: string;
  messages?: IMessage[];
  createdAt: string;
  updatedAt: string;
  user: IUser;
}

export enum EMessageSender {
  USER = 'user',
  AI = 'bot',
}

export interface IMessage {
  id: string;
  conversationId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  star?: number;
  conversation?: IConversation;
  useFul?: boolean;
  sender: EMessageSender;
}
// ===============================
// UTILITY MODELS
// ===============================

export interface ICounter {
  id: string;
  value: bigint;
}

export interface IContact {
  id: string;
  userId?: string;
  fullname: string;
  email: string;
  phone?: string;
  subject?: string;
  content: string;
  isRead?: boolean;
  reply?: string;
  replyAt?: string;
  userIdReply?: string;
  userReply?: IStaff;
  user?: IUser;
  createdAt: string;
  updatedAt: string;
}

export interface INotification {
  id: string;
  userId: string;
  title?: string;
  content: string;
  type?: string;
  isRead: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  user?: IUser;
}

export const RoomStatusLabels: Record<ERoomStatus, string> = {
  [ERoomStatus.NOT_USED]: 'Chưa sử dụng',
  [ERoomStatus.USED]: 'Đang sử dụng',
  [ERoomStatus.MAINTENANCE]: 'Bảo trì',
};

export const RoomTypeLabels: Record<ERoomType, string> = {
  [ERoomType.EXAMINATION]: 'Phòng khám',
  [ERoomType.EMERGENCY]: 'Cấp cứu',
  [ERoomType.OPERATING]: 'Phòng mổ',
  [ERoomType.INTENSIVE_CARE]: 'Hồi sức tích cực',
  [ERoomType.RECOVERY]: 'Phòng phục hồi',
  [ERoomType.PATIENT_WARD]: 'Khu bệnh nhân',
  [ERoomType.ISOLATION]: 'Phòng cách ly',
  [ERoomType.MATERNITY]: 'Sản phụ',
  [ERoomType.PEDIATRIC]: 'Nhi',
  [ERoomType.LABORATORY]: 'Phòng xét nghiệm',
  [ERoomType.RADIOLOGY]: 'X-quang/Chẩn đoán hình ảnh',
  [ERoomType.PHARMACY]: 'Nhà thuốc',
  [ERoomType.CONSULTATION]: 'Tư vấn',
  [ERoomType.WAITING]: 'Khu chờ',
  [ERoomType.STAFF]: 'Phòng nhân viên',
  [ERoomType.OFFICE]: 'Văn phòng',
};

export const DepartmentTypeLabels: Record<EDepartmentType, string> = {
  [EDepartmentType.CLINICAL]: 'Lâm sàng',
  [EDepartmentType.PARACLINICAL]: 'Cận lâm sàng',
  [EDepartmentType.ADMINISTRATIVE]: 'Hành chính',
};
export const UserGenderLabels: Record<EUserGender, string> = {
  [EUserGender.MALE]: 'Nam',
  [EUserGender.FEMALE]: 'Nữ',
  [EUserGender.OTHER]: 'Khác',
};

export const UserRoleLabels: Record<EUserRole, string> = {
  [EUserRole.PATIENT]: 'Bệnh nhân',
  [EUserRole.DOCTOR]: 'Bác sĩ',
  [EUserRole.ADMIN]: 'Quản trị viên',
  [EUserRole.STAFF]: 'Nhân viên',
  [EUserRole.PHARMACIST]: 'Dược sĩ',
  [EUserRole.ACCOUNTANT]: 'Kế toán',
};
