--
-- PostgreSQL database dump
--

\restrict H7h7NWBWan3H4IwWrhviuR6iW6kp4ePe5wuZm4PV30cL7LbCqhsbc5vwKzTOiHZ

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2026-01-15 22:20:56

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE testdb;
--
-- TOC entry 5462 (class 1262 OID 36662)
-- Name: testdb; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE testdb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';


\unrestrict H7h7NWBWan3H4IwWrhviuR6iW6kp4ePe5wuZm4PV30cL7LbCqhsbc5vwKzTOiHZ
\connect testdb
\restrict H7h7NWBWan3H4IwWrhviuR6iW6kp4ePe5wuZm4PV30cL7LbCqhsbc5vwKzTOiHZ

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- TOC entry 5463 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 910 (class 1247 OID 22810)
-- Name: AppointmentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AppointmentStatus" AS ENUM (
    'pending',
    'confirmed',
    'cancelled',
    'completed',
    'rejected',
    'in_progress',
    'checked_in',
    'no_show'
);


--
-- TOC entry 892 (class 1247 OID 22748)
-- Name: AppointmentType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AppointmentType" AS ENUM (
    'new',
    'followUp',
    'checkUp',
    'consultation',
    'telehealth'
);


--
-- TOC entry 925 (class 1247 OID 22890)
-- Name: ArticleStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ArticleStatus" AS ENUM (
    'draft',
    'pending_review',
    'published',
    'rejected',
    'reedited'
);


--
-- TOC entry 922 (class 1247 OID 22874)
-- Name: BedStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."BedStatus" AS ENUM (
    'available',
    'occupied',
    'maintenance'
);


--
-- TOC entry 889 (class 1247 OID 22740)
-- Name: DepartmentType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."DepartmentType" AS ENUM (
    'clinical',
    'paraclinical',
    'administrative'
);


--
-- TOC entry 1051 (class 1247 OID 36684)
-- Name: EntityType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EntityType" AS ENUM (
    'medical_record',
    'prescription',
    'other'
);


--
-- TOC entry 1057 (class 1247 OID 36698)
-- Name: InvoiceItemType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."InvoiceItemType" AS ENUM (
    'service',
    'medicine'
);


--
-- TOC entry 1042 (class 1247 OID 28946)
-- Name: InvoiceStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."InvoiceStatus" AS ENUM (
    'pending',
    'paid',
    'cancelled'
);


--
-- TOC entry 901 (class 1247 OID 22784)
-- Name: MedicineStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."MedicineStatus" AS ENUM (
    'available',
    'out_of_stock'
);


--
-- TOC entry 928 (class 1247 OID 22900)
-- Name: MessageSender; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."MessageSender" AS ENUM (
    'user',
    'bot'
);


--
-- TOC entry 916 (class 1247 OID 22832)
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'cash_on_delivery',
    'credit_card',
    'bank_transfer'
);


--
-- TOC entry 913 (class 1247 OID 22820)
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'refunded'
);


--
-- TOC entry 1033 (class 1247 OID 23628)
-- Name: RoomStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."RoomStatus" AS ENUM (
    'not_used',
    'used',
    'maintenance'
);


--
-- TOC entry 919 (class 1247 OID 22840)
-- Name: RoomType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."RoomType" AS ENUM (
    'examination',
    'emergency',
    'operating',
    'intensive_care',
    'recovery',
    'patient_ward',
    'isolation',
    'maternity',
    'pediatric',
    'laboratory',
    'radiology',
    'pharmacy',
    'consultation',
    'waiting',
    'staff',
    'office'
);


--
-- TOC entry 898 (class 1247 OID 22774)
-- Name: ScheduleStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ScheduleStatus" AS ENUM (
    'pending',
    'confirmed',
    'cancelled',
    'completed'
);


--
-- TOC entry 895 (class 1247 OID 22760)
-- Name: ScheduleType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ScheduleType" AS ENUM (
    'appointment',
    'work',
    'surgery',
    'duty',
    'admin',
    'off'
);


--
-- TOC entry 1054 (class 1247 OID 36692)
-- Name: SourceAppointment; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."SourceAppointment" AS ENUM (
    'online',
    'walkIn'
);


--
-- TOC entry 907 (class 1247 OID 22802)
-- Name: UserGender; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserGender" AS ENUM (
    'male',
    'female',
    'other'
);


--
-- TOC entry 904 (class 1247 OID 22790)
-- Name: UserRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserRole" AS ENUM (
    'patient',
    'doctor',
    'admin',
    'pharmacist',
    'accountant'
);


--
-- TOC entry 1048 (class 1247 OID 36674)
-- Name: VisitServiceStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."VisitServiceStatus" AS ENUM (
    'ordered',
    'in_progress',
    'done',
    'cancelled'
);


--
-- TOC entry 1045 (class 1247 OID 36664)
-- Name: VisitStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."VisitStatus" AS ENUM (
    'waiting',
    'in_progress',
    'completed',
    'cancelled'
);


--
-- TOC entry 1075 (class 1247 OID 36856)
-- Name: VisitType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."VisitType" AS ENUM (
    'new',
    'followUp',
    'checkUp',
    'consultation',
    'telehealth'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 22952)
-- Name: addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.addresses (
    id text NOT NULL,
    detail text NOT NULL,
    ward text NOT NULL,
    district text,
    city text NOT NULL,
    country text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 235 (class 1259 OID 23051)
-- Name: appointments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.appointments (
    id text NOT NULL,
    patient_id text NOT NULL,
    doctor_id text,
    booked_by_user_id text,
    type public."AppointmentType" DEFAULT 'new'::public."AppointmentType" NOT NULL,
    start_time timestamp(3) without time zone NOT NULL,
    end_time timestamp(3) without time zone,
    reason text NOT NULL,
    notes text,
    status public."AppointmentStatus" DEFAULT 'pending'::public."AppointmentStatus" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    schedule_id text,
    medical_service_id text,
    reason_cancel text,
    department_id integer,
    source public."SourceAppointment" DEFAULT 'online'::public."SourceAppointment" NOT NULL
);


--
-- TOC entry 220 (class 1259 OID 22925)
-- Name: authentications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authentications (
    user_id text NOT NULL,
    google_id text,
    facebook_id text,
    last_login timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_verified boolean DEFAULT false NOT NULL
);


--
-- TOC entry 237 (class 1259 OID 23069)
-- Name: buildings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.buildings (
    id text NOT NULL,
    hospital_id text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    floor_count integer NOT NULL
);


--
-- TOC entry 249 (class 1259 OID 23191)
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    parent_id text,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 254 (class 1259 OID 23237)
-- Name: contacts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contacts (
    id text NOT NULL,
    user_id text,
    fullname text NOT NULL,
    email text NOT NULL,
    phone text,
    subject text,
    content text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    reply text,
    reply_at timestamp(3) without time zone,
    staff_id_reply text
);


--
-- TOC entry 251 (class 1259 OID 23210)
-- Name: conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversations (
    id text NOT NULL,
    user_id text NOT NULL,
    title text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 248 (class 1259 OID 23183)
-- Name: counters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.counters (
    id text NOT NULL,
    value bigint DEFAULT 0 NOT NULL
);


--
-- TOC entry 230 (class 1259 OID 22992)
-- Name: department_deputies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.department_deputies (
    id integer NOT NULL,
    department_id integer NOT NULL,
    "userId" text NOT NULL,
    appointed_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 229 (class 1259 OID 22991)
-- Name: department_deputies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.department_deputies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5464 (class 0 OID 0)
-- Dependencies: 229
-- Name: department_deputies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.department_deputies_id_seq OWNED BY public.department_deputies.id;


--
-- TOC entry 228 (class 1259 OID 22982)
-- Name: departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    code text NOT NULL,
    phone text,
    thumbnail text,
    images text[],
    type public."DepartmentType" NOT NULL,
    head_id text,
    room_id text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 227 (class 1259 OID 22981)
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5465 (class 0 OID 0)
-- Dependencies: 227
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- TOC entry 242 (class 1259 OID 23117)
-- Name: doctor_services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.doctor_services (
    doctor_id text NOT NULL,
    medical_service_id text NOT NULL,
    price double precision NOT NULL,
    duration_minutes double precision NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


--
-- TOC entry 225 (class 1259 OID 22967)
-- Name: doctors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.doctors (
    user_id text NOT NULL,
    specialization text NOT NULL,
    license_number text,
    experience_years integer NOT NULL,
    level text NOT NULL
);


--
-- TOC entry 234 (class 1259 OID 23026)
-- Name: ehrs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ehrs (
    id text NOT NULL,
    patient_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 255 (class 1259 OID 27972)
-- Name: emergency_contacts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.emergency_contacts (
    id text NOT NULL,
    patient_id text NOT NULL,
    full_name text NOT NULL,
    relationship text NOT NULL,
    phone text NOT NULL,
    email text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 259 (class 1259 OID 36738)
-- Name: file_assets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.file_assets (
    id text NOT NULL,
    url text NOT NULL,
    entity_type public."EntityType" NOT NULL,
    entity_id text NOT NULL,
    file_type text,
    mime_type text,
    is_private boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    name text,
    size integer
);


--
-- TOC entry 250 (class 1259 OID 23199)
-- Name: health_articles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.health_articles (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    summary text,
    slug text NOT NULL,
    image_url text,
    images text[],
    view_count integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    published_at timestamp(3) without time zone,
    author_id text NOT NULL,
    category_id text NOT NULL,
    status public."ArticleStatus" DEFAULT 'draft'::public."ArticleStatus" NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    extras jsonb,
    toc jsonb,
    assignee_id text,
    reason_reject text
);


--
-- TOC entry 240 (class 1259 OID 23095)
-- Name: health_informations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.health_informations (
    id text NOT NULL,
    patient_id text NOT NULL,
    weight double precision,
    height double precision,
    blood_type text,
    has_high_blood_pressure boolean DEFAULT false,
    has_diabetes boolean DEFAULT false,
    has_allergies boolean DEFAULT false,
    has_cancer boolean DEFAULT false,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 233 (class 1259 OID 23017)
-- Name: health_insurances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.health_insurances (
    id text NOT NULL,
    user_id text NOT NULL,
    type text NOT NULL,
    insurance_id text NOT NULL,
    start_at timestamp(3) without time zone NOT NULL,
    end_at timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    initial_kcb_code text,
    initial_kcb_name text,
    level_of_benefit double precision,
    province_code text
);


--
-- TOC entry 236 (class 1259 OID 23061)
-- Name: hospitals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hospitals (
    id text NOT NULL,
    name text NOT NULL,
    address_id text,
    phone text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 260 (class 1259 OID 36747)
-- Name: invoice_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoice_items (
    id text NOT NULL,
    invoice_id text NOT NULL,
    item_type public."InvoiceItemType" NOT NULL,
    ref_id text NOT NULL,
    name text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price double precision NOT NULL,
    description text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 243 (class 1259 OID 23135)
-- Name: invoices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoices (
    id text NOT NULL,
    patient_id text NOT NULL,
    status public."InvoiceStatus" DEFAULT 'pending'::public."InvoiceStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    discount_amount double precision DEFAULT 0 NOT NULL,
    discount_reason text,
    health_insurance_id text,
    notes text,
    issued_by_user_id text,
    tax_amount double precision DEFAULT 0 NOT NULL,
    total_amount double precision DEFAULT 0 NOT NULL
);


--
-- TOC entry 226 (class 1259 OID 22974)
-- Name: managers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.managers (
    user_id text NOT NULL
);


--
-- TOC entry 258 (class 1259 OID 36730)
-- Name: medical_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medical_records (
    id text NOT NULL,
    doctor_id text,
    title text NOT NULL,
    symptoms text NOT NULL,
    diagnosis text NOT NULL,
    treatments text NOT NULL,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    "visitId" text NOT NULL,
    is_parent boolean DEFAULT false NOT NULL
);


--
-- TOC entry 241 (class 1259 OID 23107)
-- Name: medical_services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medical_services (
    id text NOT NULL,
    image_url text[],
    room_id text,
    name text NOT NULL,
    description text,
    price double precision NOT NULL,
    unit text,
    duration_minutes double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    percent_apply_health_insurance double precision DEFAULT 0 NOT NULL,
    department_id integer NOT NULL
);


--
-- TOC entry 247 (class 1259 OID 23174)
-- Name: medicine_usages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medicine_usages (
    id text NOT NULL,
    prescription_id text NOT NULL,
    medicine_id text,
    quantity integer DEFAULT 1 NOT NULL,
    price double precision NOT NULL,
    note text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    is_purchased boolean DEFAULT true NOT NULL,
    drug_name text
);


--
-- TOC entry 245 (class 1259 OID 23156)
-- Name: medicines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medicines (
    id text NOT NULL,
    name text NOT NULL,
    generic_name text NOT NULL,
    brand_name text NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    form text NOT NULL,
    dosage text NOT NULL,
    unit text NOT NULL,
    price double precision NOT NULL,
    manufacturer text NOT NULL,
    country text NOT NULL,
    side_effects text[],
    interactions text[],
    indications text[],
    contraindications text[],
    storage_conditions text,
    stock integer NOT NULL,
    status public."MedicineStatus" DEFAULT 'available'::public."MedicineStatus",
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 252 (class 1259 OID 23218)
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id text NOT NULL,
    conversation_id text NOT NULL,
    content text NOT NULL,
    sender public."MessageSender" DEFAULT 'user'::public."MessageSender" NOT NULL,
    "useFul" boolean,
    star double precision,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 222 (class 1259 OID 22945)
-- Name: names; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.names (
    first_name text NOT NULL,
    last_name text NOT NULL,
    user_id text NOT NULL
);


--
-- TOC entry 253 (class 1259 OID 23227)
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id text NOT NULL,
    user_id text NOT NULL,
    title text,
    content text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    type text
);


--
-- TOC entry 232 (class 1259 OID 23010)
-- Name: patients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.patients (
    user_id text NOT NULL,
    patient_id text NOT NULL
);


--
-- TOC entry 244 (class 1259 OID 23145)
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id text NOT NULL,
    invoice_id text NOT NULL,
    user_name text,
    payment_method public."PaymentMethod" DEFAULT 'cash_on_delivery'::public."PaymentMethod" NOT NULL,
    amount double precision DEFAULT 0 NOT NULL,
    status public."PaymentStatus" DEFAULT 'pending'::public."PaymentStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    message text,
    metadata jsonb
);


--
-- TOC entry 246 (class 1259 OID 23165)
-- Name: prescriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.prescriptions (
    id text NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    created_by_user_id text,
    visit_id text NOT NULL
);


--
-- TOC entry 218 (class 1259 OID 22906)
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name text DEFAULT 'patient'::text NOT NULL,
    prefix text NOT NULL
);


--
-- TOC entry 217 (class 1259 OID 22905)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5466 (class 0 OID 0)
-- Dependencies: 217
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 238 (class 1259 OID 23077)
-- Name: rooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rooms (
    id text NOT NULL,
    building_id text NOT NULL,
    name text NOT NULL,
    number_room integer NOT NULL,
    floor integer NOT NULL,
    type public."RoomType" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    status public."RoomStatus" DEFAULT 'not_used'::public."RoomStatus" NOT NULL
);


--
-- TOC entry 239 (class 1259 OID 23085)
-- Name: schedules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schedules (
    id text NOT NULL,
    staff_id text NOT NULL,
    department_id integer NOT NULL,
    type public."ScheduleType" DEFAULT 'work'::public."ScheduleType" NOT NULL,
    room_id text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    status public."ScheduleStatus" DEFAULT 'confirmed'::public."ScheduleStatus" NOT NULL,
    max_slot integer,
    start_time timestamp(3) without time zone NOT NULL,
    end_time timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 231 (class 1259 OID 23002)
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    user_id text NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 224 (class 1259 OID 22960)
-- Name: staffs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.staffs (
    user_id text NOT NULL,
    staff_id text NOT NULL,
    department_id integer NOT NULL,
    "position" text NOT NULL,
    join_time timestamp(3) without time zone NOT NULL,
    leave_time timestamp(3) without time zone
);


--
-- TOC entry 219 (class 1259 OID 22915)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id text NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    avatar text DEFAULT 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'::text,
    birthday timestamp(3) without time zone,
    gender public."UserGender" DEFAULT 'male'::public."UserGender" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    phone text,
    address_id text,
    role_id integer NOT NULL,
    citizen_id text
);


--
-- TOC entry 221 (class 1259 OID 22934)
-- Name: verification_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verification_codes (
    id text NOT NULL,
    "userId" text,
    email text,
    code text NOT NULL,
    type text NOT NULL,
    resend_count integer DEFAULT 0 NOT NULL,
    last_resend_at timestamp(3) without time zone,
    channel text DEFAULT 'EMAIL'::text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 257 (class 1259 OID 36719)
-- Name: visit_services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visit_services (
    id text NOT NULL,
    visit_id text NOT NULL,
    medical_service_id text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    price double precision NOT NULL,
    status public."VisitServiceStatus" DEFAULT 'ordered'::public."VisitServiceStatus" NOT NULL,
    ordered_by_user_id text,
    ordered_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    paid boolean DEFAULT false
);


--
-- TOC entry 256 (class 1259 OID 36710)
-- Name: visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visits (
    id text NOT NULL,
    appointment_id text,
    ehr_id text NOT NULL,
    doctor_id text,
    medical_service_id text,
    status public."VisitStatus" DEFAULT 'in_progress'::public."VisitStatus" NOT NULL,
    start_time timestamp(3) without time zone,
    end_time timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    next_visit_date timestamp(3) without time zone,
    "patientUserId" text,
    type public."VisitType" DEFAULT 'new'::public."VisitType"
);


--
-- TOC entry 4937 (class 2604 OID 29130)
-- Name: department_deputies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_deputies ALTER COLUMN id SET DEFAULT nextval('public.department_deputies_id_seq'::regclass);


--
-- TOC entry 4935 (class 2604 OID 29131)
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- TOC entry 4923 (class 2604 OID 29132)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 5419 (class 0 OID 22952)
-- Dependencies: 223
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.addresses VALUES ('77a78b7d-b674-4ef1-8d1f-37974eba72f6', '110 Trần Phú', 'Mộ Lao', 'Hà Đông', 'Hà Nội', 'Việt Nam', '2025-10-23 15:28:07.469', '2025-10-23 15:28:07.469');
INSERT INTO public.addresses VALUES ('c0a99273-fd47-4925-8d0a-74c2bd4ba252', '203 Trần Phú', 'Văn Quán', 'Hà Đông', 'Hà Nội', 'Việt Nam', '2025-10-23 16:18:28.587', '2025-10-23 16:18:28.587');
INSERT INTO public.addresses VALUES ('5f42b110-f10c-4db3-81a7-ed07247ccc3d', 'Dốc Ngọc Hà', 'Phường Ngọc Hà', NULL, 'Thành phố Hà Nội', 'Việt Nam', '2025-12-30 05:59:44.185', '2025-12-30 05:59:44.185');
INSERT INTO public.addresses VALUES ('caeaa5c7-2e17-4a5b-9526-04ae5e01edb5', '268 Trần Phú', 'Văn Quán', 'Hà Đông', 'Hà Nội', 'Việt Nam', '2025-10-24 08:33:01.137', '2025-10-24 08:33:01.137');
INSERT INTO public.addresses VALUES ('44634aee-f461-4f96-bffc-c29bfc105532', '268 Trần Phú', 'Văn Quán', 'Hà Đông', 'Hà Nội', 'Việt Nam', '2025-10-24 08:33:01.165', '2025-10-24 08:33:01.165');
INSERT INTO public.addresses VALUES ('c5aa1fff-114a-40d5-a0e3-ded41809781e', '15 Nguyễn Huệ', 'Bạch Đằng', 'Hoàn Kiếm', 'Hà Nội', 'Việt Nam', '2025-10-24 08:33:01.173', '2025-10-24 08:33:01.173');
INSERT INTO public.addresses VALUES ('146bc62a-bde4-485a-a5e3-fb586d88e5df', '268 Trần Phú', 'Văn Quán', 'Hà Đông', 'Hà Nội', 'Việt Nam', '2025-10-24 08:35:34.001', '2025-10-24 08:35:34.001');
INSERT INTO public.addresses VALUES ('1fa79d81-7136-489b-981e-e9ba9af9cf4d', '268 Trần Phú', 'Văn Quán', 'Hà Đông', 'Hà Nội', 'Việt Nam', '2025-10-24 08:35:34.022', '2025-10-24 08:35:34.022');
INSERT INTO public.addresses VALUES ('a4c667fe-e487-4840-b4a0-393dc08f6edd', '15 Nguyễn Huệ', 'Bạch Đằng', 'Hoàn Kiếm', 'Hà Nội', 'Việt Nam', '2025-10-24 08:35:34.028', '2025-10-24 08:35:34.028');
INSERT INTO public.addresses VALUES ('4e56b6a6-26c0-4e03-a722-875ee6f1cffb', '23 Tô Hiến Thành', 'Hai Bà Trưng', 'Hai Bà Trưng', 'Hà Nội', 'Việt Nam', '2025-10-24 08:35:34.033', '2025-10-24 08:35:34.033');
INSERT INTO public.addresses VALUES ('609d41ff-9d73-470a-914f-1f349b08ce42', '123 Lê Lợi', 'Phúc Xá', 'Ba Đình', 'Hà Nội', 'Việt Nam', '2025-10-24 08:35:34.037', '2025-10-24 08:35:34.037');
INSERT INTO public.addresses VALUES ('ed743e27-579e-43e6-b8e9-40bfc62cf34c', '67 Phạm Ngọc Thạch', 'Kim Liên', 'Đống Đa', 'Hà Nội', 'Việt Nam', '2025-10-24 08:35:34.042', '2025-10-24 08:35:34.042');
INSERT INTO public.addresses VALUES ('0f8381d2-02b6-4567-8806-c3f58749fc85', '268 Trần Phú', 'Văn Quán', 'Hà Đông', 'Hà Nội', 'Việt Nam', '2025-10-24 08:37:56.675', '2025-10-24 08:37:56.675');
INSERT INTO public.addresses VALUES ('c2073812-a576-43fe-b0e5-3207178e2504', '268 Trần Phú', 'Văn Quán', 'Hà Đông', 'Hà Nội', 'Việt Nam', '2025-10-24 08:37:56.705', '2025-10-24 08:37:56.705');
INSERT INTO public.addresses VALUES ('d08313c1-796b-4791-9364-3325e610dce2', '15 Nguyễn Huệ', 'Bạch Đằng', 'Hoàn Kiếm', 'Hà Nội', 'Việt Nam', '2025-10-24 08:37:56.712', '2025-10-24 08:37:56.712');
INSERT INTO public.addresses VALUES ('330cd0a8-9631-48e7-8d39-223ae8edfb92', '23 Tô Hiến Thành', 'Hai Bà Trưng', 'Hai Bà Trưng', 'Hà Nội', 'Việt Nam', '2025-10-24 08:37:56.719', '2025-10-24 08:37:56.719');
INSERT INTO public.addresses VALUES ('6642cf3c-d924-47d7-8e98-79d88469a09c', '123 Lê Lợi', 'Phúc Xá', 'Ba Đình', 'Hà Nội', 'Việt Nam', '2025-10-24 08:37:56.725', '2025-10-24 08:37:56.725');
INSERT INTO public.addresses VALUES ('98a5bcbd-1521-4ae7-bd69-0e69382cbb39', '67 Phạm Ngọc Thạch', 'Kim Liên', 'Đống Đa', 'Hà Nội', 'Việt Nam', '2025-10-24 08:37:56.73', '2025-10-24 08:37:56.73');
INSERT INTO public.addresses VALUES ('9083f45a-d91c-48d9-91ba-b25290d6c817', '45 Đinh Tiên Hoàng', 'Hàng Bạc', 'Hoàn Kiếm', 'Hà Nội', 'Việt Nam', '2025-10-24 08:37:56.736', '2025-10-24 08:37:56.736');
INSERT INTO public.addresses VALUES ('c8db4baa-12c9-4826-8d13-7f2ed4f9d372', '89 Hoàng Cầu', 'Ô Chợ Dừa', 'Đống Đa', 'Hà Nội', 'Việt Nam', '2025-10-24 08:37:56.742', '2025-10-24 08:37:56.742');
INSERT INTO public.addresses VALUES ('8a5a92b5-a4d2-4f20-b3fb-84ed52e8b882', '78 Nguyễn Trãi', 'Thanh Xuân Trung', 'Thanh Xuân', 'Hà Nội', 'Việt Nam', '2025-10-24 08:37:56.749', '2025-10-24 08:37:56.749');
INSERT INTO public.addresses VALUES ('2209bc18-dc33-43c2-b584-3c379bdf9888', '34 Giải Phóng', 'Phương Mai', 'Đống Đa', 'Hà Nội', 'Việt Nam', '2025-10-24 08:37:56.755', '2025-10-24 08:37:56.755');
INSERT INTO public.addresses VALUES ('5fb7ce1a-6b39-48a9-9d77-297d758f7eeb', '56 Phạm Hùng', 'Mỹ Đình', 'Nam Từ Liêm', 'Hà Nội', 'Việt Nam', '2025-10-24 08:37:56.761', '2025-10-24 08:37:56.761');
INSERT INTO public.addresses VALUES ('a4a86d4a-fcd2-4fca-b212-72ff908b47a7', '101 Cầu Giấy', 'Quan Hoa', 'Cầu Giấy', 'Hà Nội', 'Việt Nam', '2025-10-24 08:37:56.765', '2025-10-24 08:37:56.765');
INSERT INTO public.addresses VALUES ('ddadef5a-b54e-4cd5-82e8-916a71005c65', '99 Láng Hạ', 'Láng Hạ', 'Đống Đa', 'Hà Nội', 'Việt Nam', '2025-10-24 08:37:56.771', '2025-10-24 08:37:56.771');
INSERT INTO public.addresses VALUES ('e774a756-1da8-483e-82c6-f493daf178fb', '22 Hồ Tùng Mậu', 'Mai Dịch', 'Cầu Giấy', 'Hà Nội', 'Việt Nam', '2025-10-24 08:37:56.777', '2025-10-24 08:37:56.777');
INSERT INTO public.addresses VALUES ('3405b622-6f20-4b28-946a-ae74b48e4940', 'Tiêu Long', 'Phường Tam Sơn', NULL, 'Bắc Ninh', 'Việt Nam', '2025-11-01 07:57:32.531', '2025-11-01 07:57:32.531');
INSERT INTO public.addresses VALUES ('f8aaca16-1571-4ec2-9949-d8fe840c6f31', '197 Trần Phú Hà Đông', 'Xã Bình Lư', 'Hà Đông', 'Lai Châu', 'Việt Nam', '2025-10-23 16:18:28.547', '2025-11-27 19:08:44.599');
INSERT INTO public.addresses VALUES ('9166b476-c808-47df-b4a7-514077569c73', '197 Trần Phú', 'Xã Bình Lư', 'Hà Đông', 'Thành phố Từ Sơn', 'Việt Nam', '2025-11-27 19:14:41.698', '2025-11-27 19:21:28.071');
INSERT INTO public.addresses VALUES ('d4886a1a-d213-4b20-82c3-78b617dc9415', 'Khu phố Hòa Bình', 'Xã Liêm Hà', NULL, 'Tỉnh Ninh Bình', 'Vietnam', '2025-12-18 07:43:33.491', '2025-12-18 07:43:33.491');
INSERT INTO public.addresses VALUES ('ff8913a1-0552-4484-9512-0ef6714c66e7', 'Khu phố Tân Lập', 'Phường Đường Hào', NULL, 'Tỉnh Hưng Yên', 'Vietnam', '2025-12-18 07:54:21.535', '2025-12-18 07:54:21.535');


--
-- TOC entry 5431 (class 0 OID 23051)
-- Dependencies: 235
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.appointments VALUES ('e29c3065-9964-4767-9d25-dc0173fe8978', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2025-12-25 00:00:00', '2025-12-25 01:00:00', 'Bệnh ốm', 'Đã hủy. Lý do: Tôi bị bận công việc.', 'cancelled', '2025-11-25 16:21:08.322', '2025-12-09 11:17:24.824', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed36', '550e8400-e29b-41d4-a716-446655440001', NULL, NULL, 'online');
INSERT INTO public.appointments VALUES ('e821435e-f274-417c-a643-819b7623652c', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2025-12-10 02:00:00', '2025-12-10 02:30:00', 'Mắt đỏ', 'Khám cẩn thận', 'confirmed', '2025-12-10 11:44:47.775', '2025-12-10 11:44:47.775', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed36', '550e8400-e29b-41d4-a716-446655440001', NULL, NULL, 'online');
INSERT INTO public.appointments VALUES ('5d1cad43-440e-4552-a7c9-e4b86f19d627', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2025-12-10 01:00:00', '2025-12-10 01:30:00', 'Mắt đỏ', NULL, 'confirmed', '2025-12-10 11:35:53.731', '2025-12-10 11:35:53.731', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed36', '550e8400-e29b-41d4-a716-446655440001', NULL, NULL, 'online');
INSERT INTO public.appointments VALUES ('d6bce9e3-50e8-43af-9334-803c2585961f', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2025-12-10 03:30:00', '2025-12-10 04:00:00', 'Đau bụng', '1', 'confirmed', '2025-12-10 12:20:34.386', '2025-12-17 17:09:11.114', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed36', '550e8400-e29b-41d4-a716-446655440001', NULL, NULL, 'online');
INSERT INTO public.appointments VALUES ('e59b17e8-aa35-407e-9a3d-b3cc90a13ba8', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2025-12-10 04:30:00', '2025-12-10 05:00:00', 'Đau bụng', '1', 'rejected', '2025-12-10 12:19:57.676', '2025-12-17 17:10:47.307', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed36', '550e8400-e29b-41d4-a716-446655440001', 'Bác sĩ bận', NULL, 'online');
INSERT INTO public.appointments VALUES ('e29c3065-9964-4767-9d25-dc0173fe8979', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2025-12-26 00:00:00', '2025-12-26 01:00:00', 'Mắt tôi đang bị đau, nhìn bị mờ. Tôi muốn được ưu tiên khám.', 'Tôi cần được khám càng sớm càng tốt.', 'pending', '2025-11-25 16:21:08.322', '2025-12-18 18:02:07.984', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed36', '550e8400-e29b-41d4-a716-446655440001', NULL, NULL, 'online');
INSERT INTO public.appointments VALUES ('fc201e81-97d3-4bfe-a506-2c602391aa34', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2025-12-21 01:00:00', '2025-12-21 01:30:00', 'Mắt nhìn không rõ. Tôi đi khám để đo lại kính.', 'Ưu tiên dịch vụ tốt', 'pending', '2025-12-19 17:19:40.049', '2025-12-19 17:19:40.049', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed37', '550e8400-e29b-41d4-a716-446655440001', NULL, NULL, 'online');
INSERT INTO public.appointments VALUES ('2dcadda1-579d-41a2-a042-ead425d8045f', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2025-12-29 02:00:00', '2025-12-29 02:30:00', 'Mắt nhìn không rõ.', 'Khám gấp', 'pending', '2025-12-29 05:07:46.894', '2025-12-29 05:07:46.894', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed38', '550e8400-e29b-41d4-a716-446655440001', NULL, NULL, 'online');
INSERT INTO public.appointments VALUES ('fdfdd73e-cd95-4b75-9016-7805a24ded85', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2025-12-28 23:00:00', '2025-12-28 23:30:00', 'Đau bụng', '1', 'pending', '2025-12-29 06:37:29.674', '2025-12-29 06:37:29.674', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed38', '550e8400-e29b-41d4-a716-446655440001', NULL, 1, 'online');
INSERT INTO public.appointments VALUES ('01a9e0a2-89f5-42b3-99ea-ff2cb078d1be', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2025-12-29 01:30:00', '2025-12-29 02:00:00', 'd', 'd', 'pending', '2025-12-29 06:38:04.875', '2025-12-29 06:38:04.875', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed38', '550e8400-e29b-41d4-a716-446655440001', NULL, 1, 'online');
INSERT INTO public.appointments VALUES ('841abd39-2d84-49c1-a8ac-a9077758dfe3', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2025-12-29 04:30:00', '2025-12-29 05:00:00', 'd', 'd', 'pending', '2025-12-29 06:39:45.873', '2025-12-29 06:39:45.873', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed38', '550e8400-e29b-41d4-a716-446655440001', NULL, 1, 'online');
INSERT INTO public.appointments VALUES ('1358add8-64a1-4af3-818d-9d7b55b430ad', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2025-12-29 06:00:00', '2025-12-29 06:30:00', 'f', 'f', 'pending', '2025-12-29 06:48:05.634', '2025-12-29 06:48:05.634', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed38', '550e8400-e29b-41d4-a716-446655440001', NULL, 1, 'online');
INSERT INTO public.appointments VALUES ('9820627b-4ead-49cd-936d-2fd6f7fe2329', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2025-12-29 07:00:00', '2025-12-29 07:30:00', 'q', 'q', 'pending', '2025-12-29 06:55:54.931', '2025-12-29 06:55:54.931', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed38', '550e8400-e29b-41d4-a716-446655440001', NULL, 1, 'online');
INSERT INTO public.appointments VALUES ('d57bff3b-b889-4ee8-8680-9d2d731346ac', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2025-12-29 03:00:00', '2025-12-29 03:30:00', '1', '1', 'pending', '2025-12-29 07:04:31.957', '2025-12-29 07:04:31.957', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed38', '550e8400-e29b-41d4-a716-446655440001', NULL, 1, 'online');
INSERT INTO public.appointments VALUES ('ef94df25-b183-4447-947c-0518649ec62d', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2025-12-28 17:30:00', '2025-12-28 18:00:00', 'Mắt nhìn kém', NULL, 'confirmed', '2025-12-29 05:46:42.142', '2025-12-29 17:24:20.756', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed38', '550e8400-e29b-41d4-a716-446655440001', NULL, NULL, 'online');
INSERT INTO public.appointments VALUES ('8bf4f864-5202-4532-83b7-4058b048bec4', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2025-12-30 04:30:00', '2025-12-30 05:00:00', 'Ha', 'fdf', 'confirmed', '2025-12-29 18:02:42.156', '2025-12-30 10:32:03.696', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed38', '550e8400-e29b-41d4-a716-446655440001', NULL, 1, 'online');
INSERT INTO public.appointments VALUES ('ae6753e4-f900-4ebf-8923-3fc07eb39792', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2026-01-03 04:00:00', '2026-01-03 04:30:00', 'Khám tai', 'Khám mũi', 'pending', '2026-01-03 05:26:16.922', '2026-01-03 05:26:16.922', 'a221a762-e2a2-40ae-8e76-610e3d541703', '550e8400-e29b-41d4-a716-446655440002', NULL, 1, 'online');
INSERT INTO public.appointments VALUES ('02772ec4-8b96-418b-a0a9-3db2d0974292', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2026-01-03 11:00:00', '2026-01-03 11:30:00', 'Khám mắt', 'Khám lại', 'pending', '2026-01-03 05:27:40.657', '2026-01-03 05:27:40.657', 'a221a762-e2a2-40ae-8e76-610e3d541703', '550e8400-e29b-41d4-a716-446655440001', NULL, 1, 'online');
INSERT INTO public.appointments VALUES ('4d014894-8ec3-4db0-aedd-834ebe97a843', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2026-01-08 05:00:00', '2026-01-08 05:30:00', '12', '21', 'confirmed', '2026-01-08 04:52:18.246', '2026-01-08 05:18:02.381', '54e21d37-cfd7-4c05-b4c8-abaf59dd1f22', '550e8400-e29b-41d4-a716-446655440001', NULL, 1, 'online');
INSERT INTO public.appointments VALUES ('71c3cf48-d321-46d7-9e5b-3171f110cf2c', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2026-01-08 05:30:00', '2026-01-08 06:00:00', 'Đau mắt', NULL, 'confirmed', '2026-01-08 04:51:34.715', '2026-01-08 06:32:36.507', '54e21d37-cfd7-4c05-b4c8-abaf59dd1f22', '550e8400-e29b-41d4-a716-446655440001', NULL, 1, 'online');
INSERT INTO public.appointments VALUES ('b5edf70f-ac00-4fce-804a-782d9514a293', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2026-01-14 04:00:00', '2026-01-14 04:30:00', 'Mắt', NULL, 'pending', '2026-01-08 06:39:30.038', '2026-01-08 06:39:30.038', '6fd377a6-5e07-420f-892c-80f3cf4b7cb7', '550e8400-e29b-41d4-a716-446655440001', NULL, 1, 'online');
INSERT INTO public.appointments VALUES ('c3f34062-fe67-4763-840f-eb8d09772ab7', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2026-01-14 05:00:00', '2026-01-14 05:30:00', 'ho', 'f', 'rejected', '2026-01-08 06:14:02.084', '2026-01-08 06:40:38.182', '6fd377a6-5e07-420f-892c-80f3cf4b7cb7', '550e8400-e29b-41d4-a716-446655440002', 'Trùng lịch', 1, 'online');
INSERT INTO public.appointments VALUES ('627ed4c9-3f20-4305-82ae-f67c1124898d', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2026-01-14 03:30:00', '2026-01-14 04:00:00', 'Đau mắt', NULL, 'rejected', '2026-01-08 06:32:05.348', '2026-01-08 06:42:41.174', '6fd377a6-5e07-420f-892c-80f3cf4b7cb7', '550e8400-e29b-41d4-a716-446655440001', 'Trùng lịch', 1, 'online');
INSERT INTO public.appointments VALUES ('3e97fe5a-2ee4-4a22-ad76-9cc2fca44379', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2026-01-14 04:30:00', '2026-01-14 05:00:00', 'ha', 'f', 'pending', '2026-01-08 13:50:15.3', '2026-01-08 13:50:15.3', '6fd377a6-5e07-420f-892c-80f3cf4b7cb7', '550e8400-e29b-41d4-a716-446655440001', NULL, 1, 'online');
INSERT INTO public.appointments VALUES ('2380290d-1163-4582-95b1-5bc5dabb75fa', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2026-01-09 05:30:00', '2026-01-09 06:00:00', 'f', 'fd', 'confirmed', '2026-01-09 05:23:34.085', '2026-01-09 05:26:22.072', 'a63fb8c8-25d5-449d-8b3b-f0a7dc1c381f', '550e8400-e29b-41d4-a716-446655440001', NULL, 1, 'online');
INSERT INTO public.appointments VALUES ('69aa6d0c-c746-47dc-8ea5-ce155cccee1f', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2026-01-12 03:30:00', '2026-01-12 04:00:00', 'fg', 'gf', 'pending', '2026-01-09 07:19:30.593', '2026-01-09 07:19:30.593', 'c3e26ffd-0e70-4c60-8be0-c554bfb06885', '550e8400-e29b-41d4-a716-446655440001', NULL, 1, 'online');
INSERT INTO public.appointments VALUES ('d795cc52-fa7c-46b7-a7e4-e7168c50d8c3', 'e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2026-01-12 03:00:00', '2026-01-12 03:30:00', 'f', 'f', 'confirmed', '2026-01-09 05:25:36.078', '2026-01-09 07:20:54.134', 'c3e26ffd-0e70-4c60-8be0-c554bfb06885', '550e8400-e29b-41d4-a716-446655440001', NULL, 1, 'online');
INSERT INTO public.appointments VALUES ('d81da1f1-9242-45cf-8bbe-99f86fc060c9', 'e29c3065-9964-4767-9d25-dc0173fe8978', '2e335910-80af-443b-a1a3-3be509ae1b4d', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new', '2026-01-12 00:00:00', '2026-01-12 00:30:00', 'Cao huyết áp', 'Cao huyết áp', 'confirmed', '2026-01-09 08:51:20.809', '2026-01-09 08:51:58.334', '15017972-ba78-4270-ab23-b68aded2a406', '550e8400-e29b-41d4-a716-446655440008', NULL, 4, 'online');


--
-- TOC entry 5416 (class 0 OID 22925)
-- Dependencies: 220
-- Data for Name: authentications; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.authentications VALUES ('4de0fd7f-1696-4945-9549-22ae13666300', NULL, NULL, NULL, '2025-10-24 07:06:00.254', true);
INSERT INTO public.authentications VALUES ('2e335910-80af-443b-a1a3-3be509ae1b4d', NULL, NULL, '2026-01-09 08:53:46.175', '2025-10-24 08:37:56.744', true);
INSERT INTO public.authentications VALUES ('e29c3065-9964-4767-9d25-dc0173fe8978', '105947589554527380922', NULL, '2026-01-10 15:50:38.73', '2025-10-24 07:06:00.254', true);
INSERT INTO public.authentications VALUES ('1a9a6186-1036-44ae-bf1e-0db7304f9b8c', NULL, NULL, '2026-01-10 16:43:35.14', '2025-10-24 08:37:56.687', true);
INSERT INTO public.authentications VALUES ('3f3ab543-09d5-475b-8e57-366330d4f400', NULL, NULL, '2026-01-10 16:48:46.232', '2025-10-24 07:06:00.254', true);
INSERT INTO public.authentications VALUES ('698259b2-f399-45c1-b673-b2721cf0ea16', NULL, NULL, NULL, '2025-10-24 08:37:56.707', true);
INSERT INTO public.authentications VALUES ('61a78a93-ca60-4f23-921b-10ff69883f25', NULL, NULL, NULL, '2025-10-24 08:37:56.714', true);
INSERT INTO public.authentications VALUES ('422d8921-79bc-4dd8-99ae-c7858471798a', NULL, NULL, NULL, '2025-10-24 08:37:56.721', true);
INSERT INTO public.authentications VALUES ('f470d774-c3d1-48eb-bc77-eb0159621190', NULL, NULL, NULL, '2025-10-24 08:37:56.727', true);
INSERT INTO public.authentications VALUES ('eb0d5ec2-cd89-4034-bfbf-c33717d8c9f4', NULL, NULL, NULL, '2025-10-24 08:37:56.733', true);
INSERT INTO public.authentications VALUES ('a392675f-8c93-41d2-bde3-e42141e76cef', NULL, NULL, NULL, '2025-10-24 08:37:56.739', true);
INSERT INTO public.authentications VALUES ('d7cb3ba8-4ac2-44e6-bfca-02b185a75730', NULL, NULL, NULL, '2025-10-24 08:37:56.751', true);
INSERT INTO public.authentications VALUES ('ecf73bd5-3066-48ec-bfa2-88dd85ad98cf', NULL, NULL, NULL, '2025-10-24 08:37:56.757', true);
INSERT INTO public.authentications VALUES ('4ed76fa3-ae06-47ab-94f3-d531a180b952', NULL, NULL, NULL, '2025-10-24 08:37:56.762', true);
INSERT INTO public.authentications VALUES ('d736450a-deca-4f2d-9c22-8480849814ba', NULL, NULL, NULL, '2025-10-24 08:37:56.768', true);
INSERT INTO public.authentications VALUES ('e09c8604-abe4-48a3-83ea-895cbaeb24c9', NULL, NULL, NULL, '2025-10-24 08:37:56.773', true);
INSERT INTO public.authentications VALUES ('e55f2173-06f4-4fe1-ad97-ae963755ea33', NULL, NULL, NULL, '2025-10-24 08:37:56.778', true);
INSERT INTO public.authentications VALUES ('57018bfc-c48e-4725-bd80-76f7158f9184', NULL, NULL, NULL, '2025-12-18 07:43:33.509', true);
INSERT INTO public.authentications VALUES ('cf5f6586-3f10-4bdf-a9d5-525f76c69382', NULL, NULL, NULL, '2025-12-18 07:54:21.542', true);
INSERT INTO public.authentications VALUES ('06f472db-0bfd-4a08-b23f-e44f2bc14330', '105268131723468582166', NULL, '2025-11-27 17:24:59.659', '2025-11-01 07:57:32.536', true);
INSERT INTO public.authentications VALUES ('23078f0b-a5e9-4c90-84d4-e0738552033a', NULL, NULL, NULL, '2025-12-30 05:59:44.195', true);


--
-- TOC entry 5433 (class 0 OID 23069)
-- Dependencies: 237
-- Data for Name: buildings; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.buildings VALUES ('6095fa30-8753-44ce-9729-45cd9edb27bf', '6557b68c-49fe-4345-9170-a76c22065e6a', 'Tòa nhà A - Khu Khám bệnh', '2025-10-07 12:32:23.317', '2025-10-07 12:32:23.317', 5);
INSERT INTO public.buildings VALUES ('d2c23f3e-1309-4b36-88d9-4db6e8286e3c', '6557b68c-49fe-4345-9170-a76c22065e6a', 'Tòa nhà B - Khu Điều trị', '2025-10-07 12:32:23.317', '2025-10-07 12:32:23.317', 5);
INSERT INTO public.buildings VALUES ('1388bb07-05e6-4a67-8a04-80e8677cd671', '6557b68c-49fe-4345-9170-a76c22065e6a', 'Tòa nhà C - Khu Hành chính', '2025-10-07 12:32:23.317', '2025-10-07 12:32:23.317', 3);


--
-- TOC entry 5445 (class 0 OID 23191)
-- Dependencies: 249
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.categories VALUES ('e7bc7eb5-d9d0-4b2c-b333-d71937a64818', 'Tim mạch', 'tim-mach', NULL, 'Tim giúp bơm máu đi khắp cơ thể để nuôi các cơ quan khác. Nếu tim có bất kỳ sự gián đoạn hay suy yếu nào, sức khỏe có thể bị ảnh hưởng nghiêm trọng. Tìm hiểu cách tăng cường và bảo vệ sức khỏe tim mạch ngay tại đây.', '2025-10-12 13:27:48.011', '2025-10-12 13:27:48.011');
INSERT INTO public.categories VALUES ('1ef234e8-6486-43a1-8fb7-65fe93349f99', 'Hô hấp', 'ho-hap', NULL, 'Phổi và hệ hô hấp phối hợp đưa oxy trong không khí vào cơ thể, đồng thời loại bỏ carbon dioxide khi thở ra, giúp duy trì các chức năng quan trọng. Tìm hiểu cách tăng cường sức khỏe hệ hô hấp và bảo vệ phổi tại đây.', '2025-10-12 13:27:48.284', '2025-10-12 13:27:48.284');
INSERT INTO public.categories VALUES ('e0a2e156-9394-431f-8e15-48185bdeffde', 'Da liễu', 'da-lieu', NULL, 'Chăm sóc da hiệu quả giúp bạn luôn luôn tươi đẹp. Hãy tham khảo các bí quyết dưới đây.', '2025-10-12 13:27:48.515', '2025-10-12 13:27:48.515');
INSERT INTO public.categories VALUES ('4d42d0a9-feff-4459-90ce-f143a233e874', 'Ung thư và ung bướu', 'ung-thu-va-ung-buou', NULL, 'Ung thư và ung bướu là các bệnh lý phức tạp, có thể biểu hiện khác nhau tùy theo từng người và không giới hạn đối tượng hay độ tuổi. Mỗi loại ung thư đều có nguyên nhân và yếu tố nguy cơ riêng, bao gồm di truyền, môi trường, thói quen sinh hoạt và nhiều yếu tố khác. Việc nhận biết các triệu chứng sớm và nắm rõ phương pháp chẩn đoán, điều trị đóng vai trò quan trọng trong việc nâng cao hiệu quả điều trị. Để hiểu rõ hơn về nguyên nhân, dấu hiệu, các biện pháp phòng ngừa và các tiến bộ trong điều trị ung thư và ung bướu, hãy tìm hiểu chi tiết tại đây.', '2025-10-12 13:27:48.98', '2025-10-12 13:27:48.98');
INSERT INTO public.categories VALUES ('89c529a0-972d-48a5-984b-2f09ae82a95b', 'Cơ xương khớp', 'co-xuong-khop', NULL, 'Càng nhiều tuổi, hệ cơ xương khớp càng trải qua quá trình hao mòn nhất định, gây đau khớp, đau lưng cũng như các chấn thương cơ xương khớp khác, làm ảnh hưởng hoặc hạn chế khả năng vận động. Cùng tìm hiểu thêm về những tình trạng sức khỏe có thể tác động đến hệ thống cơ xương khớp của bạn ngay tại đây.', '2025-10-12 13:27:49.21', '2025-10-12 13:27:49.21');
INSERT INTO public.categories VALUES ('f7b28932-5ba2-4769-9963-0dcd5bcec68e', 'Tiêu hóa', 'tieu-hoa', NULL, 'Hệ tiêu hóa đóng vai trò thiết yếu trong việc cung cấp dưỡng chất cần thiết cho cơ thể, thông qua việc tiêu hoá, hấp thụ và phân huỷ thực phẩm. Các cơ quan như miệng, dạ dày, ruột non và ruột già, cùng gan, thận, tuyến tụy và túi mật phối hợp nhịp nhàng để đảm bảo quá trình tiêu hóa diễn ra hiệu quả. Do đó, khi một trong các cơ quan này "gặp trục trặc" - hay nói cách khác, là cơ thể mắc bệnh tiêu hoá, thì có thể phải đối mặt với nhiều vấn đề, khó khăn. Tìm hiểu thêm về các bệnh tiêu hoá thường gặp và cách điều trị để bảo vệ sức khỏe hệ tiêu hóa của bạn tại đây.', '2025-10-12 13:27:49.667', '2025-10-12 13:27:49.667');
INSERT INTO public.categories VALUES ('e4767f65-dbfc-4d76-8af6-1dd18e232975', 'Dinh dưỡng', 'dinh-duong', NULL, 'Hãy xây dựng một chế độ ăn dinh dưỡng.', '2025-10-12 13:27:49.897', '2025-10-12 13:27:49.897');
INSERT INTO public.categories VALUES ('2abfa60b-520e-432d-9cc3-b106f977911f', 'Thần kinh', 'than-kinh', NULL, 'Hệ thần kinh là trung tâm điều khiển của cơ thể, chịu trách nhiệm kiểm soát não, tủy sống và hàng nghìn tỷ dây thần kinh. Khi hệ thống phức tạp này bị tổn thương hoặc gặp vấn đề, người bệnh về não và hệ thần kinh có thể phải đối mặt với các rối loạn thần kinh nghiêm trọng như co giật, phình động mạch, u não, và nhiều tình trạng khác. Việc hiểu rõ các bệnh lý liên quan đến bệnh về não và hệ thần kinh giúp người bệnh phát hiện sớm và có biện pháp phòng ngừa, điều trị kịp thời. Tìm hiểu thêm tại đây để bảo vệ sức khỏe hệ thần kinh của bạn.', '2025-10-12 13:27:49.44', '2025-10-12 13:27:49.44');
INSERT INTO public.categories VALUES ('2abfa60b-520e-432d-9cc3-b106f977911a', 'Làm đẹp', 'lam-dep', NULL, 'Làm đẹp là tốt', '2025-10-12 13:27:49.44', '2025-10-12 13:27:49.44');
INSERT INTO public.categories VALUES ('2abfa60b-520e-432d-9cc3-b106f977911b', 'Bà bầu', 'ba-bau', NULL, 'Bà bầu là tốt', '2025-10-12 13:27:49.44', '2025-10-12 13:27:49.44');
INSERT INTO public.categories VALUES ('15203cc2-91a1-40cf-8973-ad02b227bbbb', 'Truyền nhiễm', 'truyen-nhiem', NULL, 'Cơ thể chúng ta là ngôi nhà của vô vàn vi sinh vật khác nhau. Dù thường vô hại nhưng chúng vẫn có thể đe dọa sức khỏe. Hãy tìm hiểu thêm về các bệnh truyền nhiễm do vi khuẩn, virus, nấm hoặc ký sinh trùng tại đây.', '2025-10-12 13:27:48.749', '2025-10-12 13:27:48.749');
INSERT INTO public.categories VALUES ('2b2a3481-32ce-40f8-bed1-f6bd7b4126a4', 'Gan', 'gan', NULL, 'Gan là bộ phận quan trọng.', '2025-11-15 03:22:52.49', '2025-11-15 03:22:52.49');


--
-- TOC entry 5450 (class 0 OID 23237)
-- Dependencies: 254
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.contacts VALUES ('dbad9a09-ed25-492c-8283-45e3f232bc89', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Hoàng Long', 'nguyenminhtuan28072003@gmail.com', '0912336324', 'Phản ánh dịch vụ y tế', 'Dịch vụ khám đắt.', true, '2025-11-06 16:52:21.509', '2025-11-10 18:41:53.535', 'Cảm ơn bạn đã liên hệ. Chúng tôi đã ghi nhận yêu cầu và sẽ xử lý trong thời gian sớm nhất.', '2025-11-10 18:41:53.497', '3f3ab543-09d5-475b-8e57-366330d4f400');
INSERT INTO public.contacts VALUES ('e2de59dd-075e-483e-901e-3ac00a77ba9f', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Hoàng Long', 'nguyenminhtuan28072003@gmail.com', '0912336324', 'Phản ánh dịch vụ y tế', 'Bác sĩ vòi vĩnh tiền người nhà bệnh nhân', true, '2025-11-01 05:09:45.57', '2025-11-10 22:18:13.417', 'Cám ơn quý khách', '2025-11-10 22:18:13.414', '3f3ab543-09d5-475b-8e57-366330d4f400');
INSERT INTO public.contacts VALUES ('bd9245f4-092f-4af8-8fd3-c5b7f40e4c76', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Hoàng Long', 'nguyenminhtuan28072003@gmail.com', '0912336324', 'Phản ánh dịch vụ y tế', 'Nhân viên chăm sóc tận tình, chu đáo.', true, '2025-11-01 05:05:33.876', '2025-11-10 22:18:51.171', 'Chúc mừng quý khách đã tới khám. Chúng tôi có voucher 50% xin gửi tặng quý khách.', '2025-11-10 22:18:51.133', '3f3ab543-09d5-475b-8e57-366330d4f400');
INSERT INTO public.contacts VALUES ('3036b12f-2ba9-4fc3-a8e8-78bbdd0333cc', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Hoàng Long', 'nguyenminhtuan28072003@gmail.com', '0912336324', 'Câu hỏi về việc đặt lịch khám', 'Tôi muốn biết thêm thông tin về dịch vụ khám sức khỏe...', true, '2025-10-24 09:19:23.739', '2025-11-11 13:16:56.412', 'Cảm ơn bạn đã liên hệ. Chúng tôi đã ghi nhận yêu cầu và sẽ xử lý trong thời gian sớm nhất.', '2025-11-11 13:16:56.41', '3f3ab543-09d5-475b-8e57-366330d4f400');
INSERT INTO public.contacts VALUES ('e23459f5-3d09-47c2-8182-3c4bc9259c51', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Nguyễn Minh Sơn', 'nguyenminhtuan28072003@gmail.com', '0912336324', 'Phản ánh dịch vụ y tế', 'Dịch vụ kém', false, '2025-12-14 13:28:41.733', '2025-12-14 13:28:41.733', NULL, NULL, NULL);


--
-- TOC entry 5447 (class 0 OID 23210)
-- Dependencies: 251
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.conversations VALUES ('201a6b45-39a9-4ffd-9529-4e76ce6871d5', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Bệnh đái tháo đường là gì?...', '2025-12-06 11:05:34.595', '2025-12-06 11:05:34.595');
INSERT INTO public.conversations VALUES ('d866ed49-6348-46c5-9ce1-b18f9353d609', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Hà Nội ở đâu ?...', '2025-12-06 11:11:51.476', '2025-12-06 11:11:51.476');
INSERT INTO public.conversations VALUES ('59a3c1ee-6e78-4266-a12c-cc4f48dd5ba0', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Bắc Ninh ở đâu...', '2025-12-06 11:14:58.404', '2025-12-06 11:14:58.404');
INSERT INTO public.conversations VALUES ('f459d089-247c-4e81-b010-ab50e8e3bf14', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Các tác dụng của vitamin C...', '2025-12-06 13:44:54.689', '2025-12-06 13:44:54.689');
INSERT INTO public.conversations VALUES ('f0100657-149e-4d6b-86a0-7cbbbd2c3543', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Bệnh đại tràng...', '2025-12-06 13:49:53.721', '2025-12-06 13:49:53.721');
INSERT INTO public.conversations VALUES ('d6ffa0ff-2326-4fad-8e0e-8b91b1149f70', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Bệnh đau dạ dày là gì...', '2025-12-10 13:06:50.622', '2025-12-10 13:06:50.622');
INSERT INTO public.conversations VALUES ('0f5040b3-c160-4ffc-b1b5-2c364e0ed9ce', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Chào bạn. Tôi là Tuấn, 22 tuổi. Trời đang trở lạnh...', '2026-01-07 13:44:43.12', '2026-01-07 13:44:43.12');
INSERT INTO public.conversations VALUES ('10f51a6b-fe6a-4569-9fb3-5b70bad9eff2', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Hello. Tôi là Tuấn, 22 tuổi. Tôi đang bị ho, đau h...', '2026-01-07 14:19:00.533', '2026-01-07 14:19:00.533');
INSERT INTO public.conversations VALUES ('ad966308-df5b-4961-b204-ddad5a901083', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Chào bạn, tôi là Tuấn. Tôi đang bị trĩ. Hướng dẫn ...', '2026-01-08 06:26:27.311', '2026-01-08 06:26:27.311');
INSERT INTO public.conversations VALUES ('d6a1e0c0-db9b-4448-80bd-47f60a0dea78', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Thuốc Omeprazole 20mg dùng để chữa bệnh gì ?...', '2026-01-08 06:47:09.617', '2026-01-08 06:47:09.617');
INSERT INTO public.conversations VALUES ('69c6a42a-1768-49c5-9083-ffa9a13cec42', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'tôi bị sốt...', '2026-01-08 13:51:46.746', '2026-01-08 13:51:46.746');
INSERT INTO public.conversations VALUES ('b604fca5-e05e-40a3-8aab-55bacf663f7e', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Tôi đang cảm thấy hồi hộp và chóng mặt. Bạn nghĩ t...', '2026-01-09 08:46:12.572', '2026-01-09 08:46:12.572');
INSERT INTO public.conversations VALUES ('234a1786-7f78-4b4a-88e6-7ed353e7b6d6', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'tôi bị sốt 39 độ. Tôi nên làm gì...', '2026-01-09 08:46:56.564', '2026-01-09 08:46:56.564');


--
-- TOC entry 5444 (class 0 OID 23183)
-- Dependencies: 248
-- Data for Name: counters; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.counters VALUES ('appointment', 0);
INSERT INTO public.counters VALUES ('patient', 6);
INSERT INTO public.counters VALUES ('staff', 15);


--
-- TOC entry 5426 (class 0 OID 22992)
-- Dependencies: 230
-- Data for Name: department_deputies; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.department_deputies VALUES (1, 1, '698259b2-f399-45c1-b673-b2721cf0ea16', '2024-10-10 00:00:00', '2025-10-24 08:52:27.604', '2025-10-24 08:46:50.24');
INSERT INTO public.department_deputies VALUES (2, 2, '422d8921-79bc-4dd8-99ae-c7858471798a', '2024-01-10 00:00:00', '2025-10-24 08:55:53.962', '2025-10-24 08:52:30.24');
INSERT INTO public.department_deputies VALUES (3, 3, 'f470d774-c3d1-48eb-bc77-eb0159621190', '2024-01-10 00:00:00', '2025-10-24 08:55:53.962', '2025-10-24 08:53:21.927');
INSERT INTO public.department_deputies VALUES (4, 4, '2e335910-80af-443b-a1a3-3be509ae1b4d', '2024-01-10 00:00:00', '2025-10-24 08:55:53.962', '2025-10-24 08:53:55.671');
INSERT INTO public.department_deputies VALUES (5, 5, 'ecf73bd5-3066-48ec-bfa2-88dd85ad98cf', '2024-01-01 00:00:00', '2025-10-24 08:55:53.962', '2025-10-24 08:54:22.831');
INSERT INTO public.department_deputies VALUES (6, 6, 'd736450a-deca-4f2d-9c22-8480849814ba', '2024-01-01 00:00:00', '2025-10-24 08:55:53.962', '2025-10-24 08:55:02.279');
INSERT INTO public.department_deputies VALUES (7, 7, 'e09c8604-abe4-48a3-83ea-895cbaeb24c9', '2024-01-01 00:00:00', '2025-10-24 08:55:53.962', '2025-10-24 08:55:22.759');


--
-- TOC entry 5424 (class 0 OID 22982)
-- Dependencies: 228
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.departments VALUES (8, 'Phòng Tài Chính', 'Quản lý tài chính và các hoạt động kế toán của bệnh viện.', 'FIN008', '0123456796', 'https://maisoninterior.vn/wp-content/uploads/2025/02/2-mau-van-phong-tai-chinh-sang-trong-dang-cap.jpg', '{https://bvtb.org.vn/wp-content/uploads/2022/04/10130-1170x732.jpg}', 'administrative', NULL, 'f4b552b4-a0ff-4422-a0f1-f0885864ab73', '2025-10-24 04:43:17.597', '2025-10-24 04:43:17.597');
INSERT INTO public.departments VALUES (9, 'Phòng Kế Toán', 'Xử lý các hoạt động kế toán, báo cáo tài chính của bệnh viện.', 'ACC009', '0123456797', 'https://www.deco-crystal.com/wp-content/uploads/2024/02/van-phong-tai-chinh-tiep-don-chinh-chu.jpeg', '{https://bvtb.org.vn/wp-content/uploads/2022/04/10130-1170x732.jpg}', 'administrative', NULL, 'ede1a1d8-a04d-4e18-a5d8-4384ea46ff06', '2025-10-24 04:43:17.597', '2025-10-24 04:43:17.597');
INSERT INTO public.departments VALUES (10, 'Phòng Quản Lý Vật Tư', 'Quản lý và cung ứng vật tư, thiết bị y tế cho bệnh viện.', 'MAT010', '0123456798', 'https://benhvienbinhthuan.vn/Uploads/images/KhoaPhong/phong-vattuyte.jpg', '{https://bvtb.org.vn/wp-content/uploads/2022/04/10130-1170x732.jpg}', 'administrative', NULL, 'f9ba46b7-4b59-4a40-a35a-e107d293ee8f', '2025-10-24 04:43:17.597', '2025-10-24 04:43:17.597');
INSERT INTO public.departments VALUES (11, 'Phòng Công Nghệ Thông Tin', 'Quản lý hệ thống CNTT và hỗ trợ kỹ thuật cho bệnh viện.', 'IT011', '0123456799', 'https://teky.edu.vn/blog/wp-content/uploads/2021/08/Cong-ty-IT-so-huu-nhung-nhan-tai.jpg', '{https://bvtb.org.vn/wp-content/uploads/2022/04/10130-1170x732.jpg}', 'administrative', NULL, '2ec21ea5-b67b-4e36-a2db-7a6130ab9cf1', '2025-10-24 04:43:17.597', '2025-10-24 04:43:17.597');
INSERT INTO public.departments VALUES (14, 'Phòng Nhân sự', 'Quản lý nhân sự và đào tạo của bệnh viện.', 'HR013', '0123456799', 'https://chefjob.vn/wp-content/uploads/2020/07/hr-phong-van-tuyen-dung-nhan-su-danh-gia-nang-luc-nhan-vien.jpg', '{https://bvtb.org.vn/wp-content/uploads/2022/04/10130-1170x732.jpg}', 'administrative', NULL, 'b8eef109-e6fc-4f28-be30-c1ed5c7ca6ba', '2025-10-24 05:11:54.202', '2025-10-24 05:11:54.202');
INSERT INTO public.departments VALUES (1, 'Khoa Mắt', 'Chuyên khoa điều trị các bệnh về mắt, bao gồm phẫu thuật và khám định kỳ.', 'EYE001', '0123456789', 'https://sunshineeyecare.com/wp-content/uploads/2025/04/phong-kham-chuyen-khoa-mat.webp', '{https://bvtb.org.vn/wp-content/uploads/2022/04/10130-1170x732.jpg}', 'clinical', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2025-10-24 04:43:17.597', '2025-10-24 09:00:17.265');
INSERT INTO public.departments VALUES (2, 'Răng Hàm Mặt', 'Chăm sóc và điều trị các vấn đề về răng miệng, thẩm mỹ nha khoa.', 'DENT002', '0123456790', 'https://dakhoasaigonbaubang.vn/wp-content/uploads/2021/12/rang-ham-mat-2.jpg', '{https://bvtb.org.vn/wp-content/uploads/2022/04/10130-1170x732.jpg}', 'clinical', '61a78a93-ca60-4f23-921b-10ff69883f25', '2016170a-c3fd-499f-9d16-99a21e216945', '2025-10-24 04:43:17.597', '2025-10-24 09:00:17.265');
INSERT INTO public.departments VALUES (3, 'Khoa Sản', 'Chăm sóc sức khỏe phụ nữ mang thai và hỗ trợ sinh nở.', 'OBS003', '0123456791', 'https://cdn.diemnhangroup.com/noithatdiemnhan/2023/12/thiet-ke-phong-kham-san-phu-khoa-15.jpg', '{https://bvtb.org.vn/wp-content/uploads/2022/04/10130-1170x732.jpg}', 'clinical', 'eb0d5ec2-cd89-4034-bfbf-c33717d8c9f4', '2a1dd88b-fc72-46df-8505-4ca7ab890dc2', '2025-10-24 04:43:17.597', '2025-10-24 09:00:17.265');
INSERT INTO public.departments VALUES (4, 'Khoa Tim Mạch', 'Chẩn đoán và điều trị các bệnh lý về tim và mạch máu.', 'CARD004', '0123456792', 'https://sunshineeyecare.com/wp-content/uploads/2025/04/phong-kham-chuyen-khoa-mat.webp', '{https://bvtb.org.vn/wp-content/uploads/2022/04/10130-1170x732.jpg}', 'clinical', 'a392675f-8c93-41d2-bde3-e42141e76cef', '698f8e66-7aba-4c7f-8f35-807fc18df098', '2025-10-24 04:43:17.597', '2025-10-24 09:00:17.265');
INSERT INTO public.departments VALUES (5, 'Tai Mũi Họng', 'Chuyên khoa điều trị các bệnh về tai, mũi, họng và các vùng liên quan.', 'ENT005', '0123456793', 'https://benhvienthucuc.vn/wp-content/uploads/2021/06/kham-tai-mui-hong-o-dau-tot-2.jpg', '{https://bvtb.org.vn/wp-content/uploads/2022/04/10130-1170x732.jpg}', 'clinical', 'd7cb3ba8-4ac2-44e6-bfca-02b185a75730', 'f2f2a93a-dec3-44a8-a108-4f311f5d9cb8', '2025-10-24 04:43:17.597', '2025-10-24 09:00:17.265');
INSERT INTO public.departments VALUES (6, 'Xét Nghiệm', 'Thực hiện các xét nghiệm y khoa phục vụ chẩn đoán.', 'LAB006', '0123456794', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG7UjgutQDu9fXfy_rpwVkJzITD-DiUb4w2Q&s', '{https://bvtb.org.vn/wp-content/uploads/2022/04/10130-1170x732.jpg}', 'paraclinical', '4ed76fa3-ae06-47ab-94f3-d531a180b952', 'd0c92335-e8d7-4379-a17e-6f42be5f87c2', '2025-10-24 04:43:17.597', '2025-10-24 09:00:17.265');
INSERT INTO public.departments VALUES (7, 'Chẩn Đoán Hình Ảnh', 'Cung cấp dịch vụ chụp X-quang, CT, MRI và các kỹ thuật hình ảnh khác.', 'IMG007', '0123456795', 'https://benhvienhadong.vn/images/departments/department_1736929642.jpg', '{https://bvtb.org.vn/wp-content/uploads/2022/04/10130-1170x732.jpg}', 'paraclinical', 'e55f2173-06f4-4fe1-ad97-ae963755ea33', 'dd6ac462-6934-4c8b-81f1-7a0994bdb187', '2025-10-24 04:43:17.597', '2025-10-24 09:00:17.265');
INSERT INTO public.departments VALUES (13, 'Phòng Hành chính Quản trị', 'Quản lý hành chính và quản trị của bệnh viện.', 'ADMIN012', '0123456799', 'https://chefjob.vn/wp-content/uploads/2020/07/hr-phong-van-tuyen-dung-nhan-su-danh-gia-nang-luc-nhan-vien.jpg', '{https://bvtb.org.vn/wp-content/uploads/2022/04/10130-1170x732.jpg}', 'administrative', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e1a631b0-ca20-4184-a10e-01a31f5675a3', '2025-10-24 05:11:54.202', '2025-10-24 09:00:17.265');


--
-- TOC entry 5438 (class 0 OID 23117)
-- Dependencies: 242
-- Data for Name: doctor_services; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.doctor_services VALUES ('1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '550e8400-e29b-41d4-a716-446655440001', 200000, 30, true);
INSERT INTO public.doctor_services VALUES ('1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '550e8400-e29b-41d4-a716-446655440002', 20000000, 60, true);
INSERT INTO public.doctor_services VALUES ('61a78a93-ca60-4f23-921b-10ff69883f25', '550e8400-e29b-41d4-a716-446655440003', 150000, 20, true);
INSERT INTO public.doctor_services VALUES ('61a78a93-ca60-4f23-921b-10ff69883f25', '550e8400-e29b-41d4-a716-446655440004', 2000000, 45, true);
INSERT INTO public.doctor_services VALUES ('422d8921-79bc-4dd8-99ae-c7858471798a', '550e8400-e29b-41d4-a716-446655440003', 150000, 20, true);
INSERT INTO public.doctor_services VALUES ('422d8921-79bc-4dd8-99ae-c7858471798a', '550e8400-e29b-41d4-a716-446655440004', 2000000, 45, true);
INSERT INTO public.doctor_services VALUES ('422d8921-79bc-4dd8-99ae-c7858471798a', '550e8400-e29b-41d4-a716-446655440005', 30000000, 120, true);
INSERT INTO public.doctor_services VALUES ('f470d774-c3d1-48eb-bc77-eb0159621190', '550e8400-e29b-41d4-a716-446655440006', 300000, 20, true);
INSERT INTO public.doctor_services VALUES ('f470d774-c3d1-48eb-bc77-eb0159621190', '550e8400-e29b-41d4-a716-446655440007', 250000, 30, true);
INSERT INTO public.doctor_services VALUES ('eb0d5ec2-cd89-4034-bfbf-c33717d8c9f4', '550e8400-e29b-41d4-a716-446655440006', 300000, 20, true);
INSERT INTO public.doctor_services VALUES ('a392675f-8c93-41d2-bde3-e42141e76cef', '550e8400-e29b-41d4-a716-446655440008', 200000, 25, true);
INSERT INTO public.doctor_services VALUES ('698259b2-f399-45c1-b673-b2721cf0ea16', '550e8400-e29b-41d4-a716-446655440001', 200000, 30, false);
INSERT INTO public.doctor_services VALUES ('698259b2-f399-45c1-b673-b2721cf0ea16', '550e8400-e29b-41d4-a716-446655440002', 20000000, 60, true);
INSERT INTO public.doctor_services VALUES ('2e335910-80af-443b-a1a3-3be509ae1b4d', '550e8400-e29b-41d4-a716-446655440008', 200000, 25, true);
INSERT INTO public.doctor_services VALUES ('d7cb3ba8-4ac2-44e6-bfca-02b185a75730', '550e8400-e29b-41d4-a716-446655440009', 500000, 40, true);
INSERT INTO public.doctor_services VALUES ('ecf73bd5-3066-48ec-bfa2-88dd85ad98cf', '550e8400-e29b-41d4-a716-446655440009', 500000, 40, true);
INSERT INTO public.doctor_services VALUES ('4ed76fa3-ae06-47ab-94f3-d531a180b952', '550e8400-e29b-41d4-a716-446655440010', 300000, 15, true);
INSERT INTO public.doctor_services VALUES ('d736450a-deca-4f2d-9c22-8480849814ba', '550e8400-e29b-41d4-a716-446655440010', 300000, 15, true);
INSERT INTO public.doctor_services VALUES ('d736450a-deca-4f2d-9c22-8480849814ba', '550e8400-e29b-41d4-a716-446655440011', 1000000, 30, true);
INSERT INTO public.doctor_services VALUES ('e09c8604-abe4-48a3-83ea-895cbaeb24c9', '550e8400-e29b-41d4-a716-446655440012', 3000000, 60, true);
INSERT INTO public.doctor_services VALUES ('e09c8604-abe4-48a3-83ea-895cbaeb24c9', '550e8400-e29b-41d4-a716-446655440013', 500000, 15, true);
INSERT INTO public.doctor_services VALUES ('e55f2173-06f4-4fe1-ad97-ae963755ea33', '550e8400-e29b-41d4-a716-446655440012', 3000000, 60, true);
INSERT INTO public.doctor_services VALUES ('e55f2173-06f4-4fe1-ad97-ae963755ea33', '550e8400-e29b-41d4-a716-446655440013', 500000, 15, true);


--
-- TOC entry 5421 (class 0 OID 22967)
-- Dependencies: 225
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.doctors VALUES ('1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Khám mắt', 'MD-123456', 10, 'BSĐK');
INSERT INTO public.doctors VALUES ('698259b2-f399-45c1-b673-b2721cf0ea16', 'Khám mắt', 'MD-123486', 10, 'BSNT');
INSERT INTO public.doctors VALUES ('61a78a93-ca60-4f23-921b-10ff69883f25', 'Răng hàm mặt', 'MD-789012', 15, 'BSCK I');
INSERT INTO public.doctors VALUES ('422d8921-79bc-4dd8-99ae-c7858471798a', 'Răng hàm mặt', 'MD-789019', 8, 'BSCK II');
INSERT INTO public.doctors VALUES ('f470d774-c3d1-48eb-bc77-eb0159621190', 'Sản khoa', 'MD-345658', 12, 'PSG, TS');
INSERT INTO public.doctors VALUES ('eb0d5ec2-cd89-4034-bfbf-c33717d8c9f4', 'Sản khoa', 'MD-346779', 14, 'Ths');
INSERT INTO public.doctors VALUES ('a392675f-8c93-41d2-bde3-e42141e76cef', 'Tim mạch', 'MD-901234', 25, 'TS, BSCK II');
INSERT INTO public.doctors VALUES ('2e335910-80af-443b-a1a3-3be509ae1b4d', 'Tim mạch', 'MD-901235', 10, 'BSĐK');
INSERT INTO public.doctors VALUES ('d7cb3ba8-4ac2-44e6-bfca-02b185a75730', 'Tai mũi họng', 'MD-567890', 8, 'Ths');
INSERT INTO public.doctors VALUES ('ecf73bd5-3066-48ec-bfa2-88dd85ad98cf', 'Tai mũi họng', 'MD-567891', 16, 'BSNT');
INSERT INTO public.doctors VALUES ('4ed76fa3-ae06-47ab-94f3-d531a180b952', 'Xét nghiệm y học', 'MD-234567', 13, 'BSĐK');
INSERT INTO public.doctors VALUES ('d736450a-deca-4f2d-9c22-8480849814ba', 'Xét nghiệm y học', 'MD-234568', 7, 'Ths, BSCK I');
INSERT INTO public.doctors VALUES ('e09c8604-abe4-48a3-83ea-895cbaeb24c9', 'Chẩn đoán hình ảnh', 'MD-678901', 20, 'TS, BSCK II');
INSERT INTO public.doctors VALUES ('e55f2173-06f4-4fe1-ad97-ae963755ea33', 'Chẩn đoán hình ảnh', 'MD-678902', 9, 'GS, TS ');


--
-- TOC entry 5430 (class 0 OID 23026)
-- Dependencies: 234
-- Data for Name: ehrs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.ehrs VALUES ('d0416d3f-48a4-4188-b417-28bdd54ac620', 'e29c3065-9964-4767-9d25-dc0173fe8978', '2025-10-24 07:11:50.523', '2025-10-24 07:11:50.523');
INSERT INTO public.ehrs VALUES ('16032ba4-8d13-4753-a554-18bfdba00bdb', '4de0fd7f-1696-4945-9549-22ae13666300', '2025-10-24 07:11:50.532', '2025-10-24 07:11:50.532');
INSERT INTO public.ehrs VALUES ('d7261945-0d63-4260-9b7a-4ab721a82e96', '57018bfc-c48e-4725-bd80-76f7158f9184', '2025-12-18 08:43:46.146', '2025-12-18 08:43:46.147');
INSERT INTO public.ehrs VALUES ('4595d825-2994-41ff-952d-90e994e8020e', '23078f0b-a5e9-4c90-84d4-e0738552033a', '2025-12-30 18:52:20.42', '2025-12-30 18:52:20.423');
INSERT INTO public.ehrs VALUES ('e0f1e10c-4816-469b-8d77-fd6c51eb6a00', 'cf5f6586-3f10-4bdf-a9d5-525f76c69382', '2025-12-30 18:53:00.189', '2025-12-30 18:53:00.191');


--
-- TOC entry 5451 (class 0 OID 27972)
-- Dependencies: 255
-- Data for Name: emergency_contacts; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.emergency_contacts VALUES ('f4227ab8-c93e-44cb-916e-cbf8bcc3aeec', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Trần Thị B', 'Vợ', '0987654320', 'tran.b@example.com', '2025-11-04 14:24:04.13', '2025-11-07 05:13:57.85');
INSERT INTO public.emergency_contacts VALUES ('e29c3065-9964-4767-9d25-dc0173fe8978', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Nguyễn Văn B', 'Cha', '0912336329', 'nguyenvanthuan@gmail.com', '2025-10-26 15:25:18.937', '2025-11-07 05:14:15.468');
INSERT INTO public.emergency_contacts VALUES ('63bfc737-d6a7-48fa-b0f6-49e763c776fe', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Nguyễn Minh Tuấn', 'Anh trai', '0912336324', 'nguyenminhtuan28072003@gmail.com', '2025-11-07 05:15:19.07', '2025-11-07 05:15:19.07');


--
-- TOC entry 5455 (class 0 OID 36738)
-- Dependencies: 259
-- Data for Name: file_assets; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.file_assets VALUES ('e29c3065-9964-4767-9d25-dc0173fe8978', 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1000', 'medical_record', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'image', 'image/jpg', false, '2026-01-01 15:50:27.738', '2026-01-01 15:45:46.182', 'x-quang.jpg', 2);
INSERT INTO public.file_assets VALUES ('e29c3065-9964-4767-9d25-dc0173fe8979', 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1000', 'medical_record', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'image', 'image/jpg', false, '2026-01-01 15:50:27.745', '2026-01-01 15:46:44.262', 'lab.jpg', 2);
INSERT INTO public.file_assets VALUES ('e29c3065-9964-4767-9d25-dc0173fe8980', 'https://v30.x8top.net/tmp082020/cf/tailieu/2019/5/pdf/don-xin-viec-2019.pdf', 'medical_record', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'document', 'application/pdf', false, '2026-01-01 15:50:27.746', '2026-01-01 15:50:26.391', 'ketqua.pdf', 1);
INSERT INTO public.file_assets VALUES ('5865bd24-92ef-4b21-bc27-a19e501ab296', 'https://res.cloudinary.com/dctzo9scu/image/upload/v1767436312/healthsystem/medical-records/eca4583068ba253402745403a9780a6d.png', 'medical_record', 'b6c6670c-b18f-4142-a8b8-cbd2390b2573', 'image/png', 'image/png', true, '2026-01-03 10:33:40.652', '2026-01-03 10:33:40.652', 'image (1).png', 131559);
INSERT INTO public.file_assets VALUES ('ad7514c3-8549-4ed3-ae10-2aa95a563c0e', 'https://res.cloudinary.com/dctzo9scu/image/upload/v1767736603/healthsystem/medical-records/842b3b902494f4b7e2c5054873484c64.png', 'medical_record', 'cc8764f6-f19d-4715-9ad7-ecff3f419e89', 'image/png', 'image/png', true, '2026-01-06 21:58:39.045', '2026-01-06 21:58:39.045', 'Gemini_Generated_Image_61tlco61tlco61tl (1).png', 495693);
INSERT INTO public.file_assets VALUES ('5ae9ab28-2548-48a6-a63a-9cef79d90d4d', 'https://res.cloudinary.com/dctzo9scu/image/upload/v1767849528/healthsystem/medical-records/a6b9bc91cce687bf87edc355d9f74316.jpg', 'medical_record', '96bb1d5c-314d-42b1-b406-96a08ad5b87f', 'image/jpeg', 'image/jpeg', true, '2026-01-08 05:20:47.046', '2026-01-08 05:20:47.046', 'wp8120281.jpg', 37214);
INSERT INTO public.file_assets VALUES ('6fae7061-4fa0-4d75-b370-6e05651ede5a', 'https://res.cloudinary.com/dctzo9scu/image/upload/v1767853986/healthsystem/medical-records/0d8016e1a6386d9957afd4b81eade75d.jpg', 'medical_record', 'b8f6ae72-9245-4e58-997c-0276f7ead943', 'image/jpeg', 'image/jpeg', true, '2026-01-08 06:35:04.401', '2026-01-08 06:35:04.401', 'x-quang.jpg', 31484);
INSERT INTO public.file_assets VALUES ('f079f3bf-c733-4f64-877e-7366009618ea', 'https://res.cloudinary.com/dctzo9scu/image/upload/v1767936462/healthsystem/medical-records/d36fcecb2e2fa7b8ea1e31c8eacb9c4b.jpg', 'medical_record', '53a94ca0-72cd-4b7b-8516-50c2e213d211', 'image/jpeg', 'image/jpeg', true, '2026-01-09 05:29:42.447', '2026-01-09 05:29:42.447', 'Cachchamsocmat.jpg', 36326);


--
-- TOC entry 5446 (class 0 OID 23199)
-- Dependencies: 250
-- Data for Name: health_articles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.health_articles VALUES ('9b252a49-f164-41a7-aa1c-29cb42e70fba', 'Bài viết về Tim mạch 12', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tim-mach-12', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 102, '2025-10-01 12:00:00', '2026-01-10 15:54:53.998', '2025-10-01 12:00:00', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e7bc7eb5-d9d0-4b2c-b333-d71937a64818', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('743913cc-e252-4ef1-9704-bb169ace4c43', 'Trào ngược dạ dày gây sụt cân nguy hiểm như thế nào?', '<p><span style="color: rgb(51, 51, 51); font-size: 16px;">Trào ngược dạ dày gây sụt cân là một triệu chứng cần được chú ý, vì đây có thể là dấu hiệu cảnh báo các vấn đề nghiêm trọng, cần được chẩn đoán và điều trị kịp thời để tránh những biến chứng nguy hiểm. Đặc biệt, bệnh trào ngược dạ dày thực quản rất phổ biến với tỷ lệ mắc bệnh ở người trưởng thành dao động từ 10-20%.</span></p><h1 style="text-align: start;" id="1-trao-nguoc-da-day-thuc-quan-la-benh-gi"><span style="font-size: 19px;"><strong>1. Trào ngược dạ dày thực quản là bệnh gì?</strong></span></h1><p style="text-align: start;"><a href="https://www.vinmec.com/vie/bai-viet/benh-trao-nguoc-da-day-thuc-quan-vi" target="_blank">Trào ngược dạ dày thực quản</a> là tình trạng các chất từ dạ dày, đặc biệt là <a href="https://www.vinmec.com/vie/bai-viet/su-bai-tiet-va-hoat-dong-cua-axit-da-day-vi" target="_blank">axit dạ dày</a>, trào ngược lên thực quản, gây ra các triệu chứng khó chịu như ợ nóng, đau ngực, ho khan hoặc cảm giác khó nuốt. Nguyên nhân gây trào ngược dạ dày thực quản thường liên quan đến chế độ ăn uống không hợp lý, thói quen sinh hoạt thiếu khoa học hoặc các bất thường trong chức năng của cơ thắt thực quản dưới (LES) - cơ quan giúp ngăn ngừa trào ngược.</p><p style="text-align: start;">Ban đầu, bệnh trào ngược dạ dày thực quản thường không gây ảnh hưởng nghiêm trọng đến sức khỏe, nhưng nếu không được phát hiện và điều trị kịp thời, bệnh có thể dẫn đến nhiều biến chứng nghiêm trọng. Những biến chứng này bao gồm <a href="https://www.vinmec.com/vie/benh/loet-thuc-quan-3899" target="_blank">viêm loét thực quản</a>, <a href="https://www.vinmec.com/vie/benh/hep-thuc-quan-3326" target="_blank">hẹp thực quản</a>, <a href="https://www.vinmec.com/vie/benh/barrett-thuc-quan-3156" target="_blank">bệnh Barrett thực quản</a> (một tình trạng tiền ung thư) và đặc biệt là tăng nguy cơ <a href="https://www.vinmec.com/vie/bai-viet/ung-thu-thuc-quan-nguyen-nhan-trieu-chung-tien-luong-benh-va-cach-dieu-tri-vi" target="_blank">ung thư thực quản</a>. Do đó, việc phát hiện sớm và điều trị đúng cách là rất quan trọng để ngăn ngừa các biến chứng nguy hiểm.</p><p style="text-align: center;"><img src="https://res.cloudinary.com/dctzo9scu/image/upload/v1763988484/healthsystem/uploads/8adfac1a787f7a22811f8891cccb438a.jpg" alt="" data-href="" style="width: 782.00px;height: 449.64px;"></p><p style="text-align: center;"><span style="color: rgb(51, 51, 51); background-color: rgb(247, 247, 247); font-size: 12px;">Trào ngược dạ dày thực quản là tình trạng các chất trong dạ dày trào ngược lên thực quản, gây ra cảm giác khó chịu kéo dài cho người bệnh.</span></p><h1 style="text-align: start;" id="2-trieu-chung-benh-trao-nguoc-da-day-thuc-quan"><span style="font-size: 19px;"><strong>2. Triệu chứng bệnh trào ngược dạ dày thực quản</strong></span></h1><p style="text-align: start;">Các triệu chứng của bệnh trào ngược dạ dày thực quản thường gặp bao gồm:</p><h2 style="text-indent: 30px; text-align: start;" id="21-o-chua">2.1 Ợ chua</h2><p style="text-align: start;">Đây là triệu chứng phổ biến nhất của bệnh trào ngược dạ dày thực quản. <a href="https://www.vinmec.com/vie/bai-viet/nhung-nguyen-nhan-dan-den-chung-o-chua-vi" target="_blank">Ợ chua</a> thường xảy ra kết hợp với ợ nóng, tức là cảm giác nóng rát từ dạ dày lan lên cổ họng. Triệu chứng này thường xuất hiện sau khi ăn no - khi có cảm giác đầy bụng, khó tiêu hoặc khi nằm nghỉ ngơi.</p><h2 style="text-indent: 30px; text-align: start;" id="22-o-hoi">2.2 Ợ hơi</h2><p style="text-align: start;">Đây là triệu chứng thường gặp khi người bệnh đang đói. Tương tự như ợ chua, ợ hơi xảy ra khi quá trình tiêu hóa bị trì trệ, dẫn đến việc thức ăn trong dạ dày bị lên men, sinh ra khí. Khí này trào ngược lên thực quản và gây ra cảm giác <a href="https://www.vinmec.com/vie/bai-viet/nguyen-nhan-chuong-bung-day-hoi-keo-dai-kho-chua-dut-diem-vi" target="_blank">đầy hơi, khó chịu</a>.</p><h2 style="text-indent: 30px; text-align: start;" id="23-non-oi-buon-non">2.3 Nôn ói, buồn nôn</h2><p style="text-align: start;">Người bệnh có thể cảm thấy nghẹn hoặc <a href="https://www.vinmec.com/vie/bai-viet/vao-buon-non-la-trieu-chung-gi-vi" target="_blank">buồn nôn</a> khi thức ăn bị trào ngược lên thực quản. Triệu chứng này thường xuất hiện sau khi ăn và có thể trở nên nghiêm trọng hơn ở các đối tượng như bà bầu ốm nghén, người say sóng, say tàu xe.</p><h2 style="text-indent: 30px; text-align: start;" id="24-an-khong-ngon-chan-an-kho-nuot">2.4 Ăn không ngon, chán ăn, khó nuốt</h2><p style="text-align: start;">Đây là các triệu chứng thường cảnh báo tình trạng trào ngược axit dạ dày hoặc trào ngược dịch mật. Người bệnh có thể cảm thấy đắng miệng kèm theo cảm giác sưng ở thực quản và khó khăn khi nuốt thức ăn.</p><p style="text-align: start;"><img src="https://res.cloudinary.com/dctzo9scu/image/upload/v1763988582/healthsystem/uploads/855ae57689044512b294cb9d031000a6.jpg" alt="" data-href="" style=""></p><p style="text-align: center;"><span style="color: rgb(51, 51, 51); font-size: 12px;">Người bệnh có thể cảm nhận được vị đắng trong miệng kèm theo cảm giác sưng viêm ở thực quản, khiến việc nuốt thức ăn trở nên khó khăn, ăn không ngon, chán ăn.</span></p><h2 style="text-indent: 30px; text-align: start;" id="25-ho-viem-hong-tiet-nhieu-nuoc-bot-khan-giong">2.5 Ho, viêm họng, tiết nhiều nước bọt, khản giọng</h2><p style="text-align: start;">Những <a href="https://www.vinmec.com/vie/bai-viet/dau-hieu-trao-nguoc-da-day-ban-nen-biet-vi" target="_blank">triệu chứng trào ngược dạ dày thực quản</a> này thường do axit dạ dày trào ngược lên thực quản, gây kích thích dây thanh quản và niêm mạc họng. Khi axit dạ dày lên cao, cơ thể phản ứng bằng cách tiết ra nhiều nước bọt, dẫn đến ho, <a href="https://www.vinmec.com/vie/bai-viet/dieu-tri-viem-hong-khong-can-dung-khang-sinh-vi" target="_blank">viêm họng</a>, khản giọng và cảm giác ngứa rát ở cổ họng.</p><h1 style="text-align: start;" id="3-trao-nguoc-da-day-gay-sut-can-co-nguy-hiem-khong"><strong>3. Trào ngược dạ dày gây sụt cân có nguy hiểm không?</strong></h1><h2 style="text-indent: 30px; text-align: start;" id="31-khi-nao-trao-nguoc-da-day-gay-sut-can">3.1. Khi nào trào ngược dạ dày gây sụt cân?</h2><p style="text-align: start;">Như đã đề cập, trào ngược dạ dày thực quản không phải là nguyên nhân trực tiếp gây sụt cân ngay lập tức. Tuy nhiên, trào ngược có thể tác động mạnh đến <a href="https://www.vinmec.com/vie/bai-viet/cac-luu-y-ve-mot-che-do-uong-lanh-manh-vi" target="_blank">chế độ ăn uống</a> và chất lượng cuộc sống của người bệnh. Khi các triệu chứng kéo dài và ảnh hưởng liên tục, bệnh có thể dẫn đến tình trạng sụt cân.</p><p style="text-align: start;">Cụ thể, khi các triệu chứng nôn, buồn nôn kéo dài, lượng thức ăn vào cơ thể không được hấp thu đầy đủ dinh dưỡng, dẫn đến thiếu chất. Điều này dần dần khiến người bệnh bị sụt cân. Thêm vào đó, những triệu chứng như đắng miệng, khó nuốt kéo dài có thể làm giảm cảm giác thèm ăn, dẫn đến <a href="https://www.vinmec.com/vie/bai-viet/trong-voi-chung-chan-o-nguoi-lon-vi" target="_blank">chán ăn</a> và ăn không ngon miệng. Khi lượng thức ăn giảm, cân nặng cũng giảm theo.</p><p style="text-align: start;">Do đó, trào ngược dạ dày gây sụt cân là dấu hiệu cho thấy tình trạng bệnh có thể đang tiến triển nghiêm trọng. Người bệnh cần được thăm khám kịp thời để điều trị đúng cách, tránh các biến chứng nguy hiểm và cải thiện chất lượng cuộc sống.</p><h2 style="text-indent: 30px; text-align: start;" id="32-canh-bao-benh-ly-tieu-hoa-khac-khi-gap-trao-ngu">3.2. Cảnh báo bệnh lý tiêu hóa khác khi gặp trào ngược dạ dày sụt cân</h2><p style="text-align: start;">Ngoài việc sụt cân do ảnh hưởng từ trào ngược dạ dày thực quản, việc giảm cân bất thường có thể là dấu hiệu cảnh báo các bệnh lý tiêu hóa nghiêm trọng khác mà người bệnh không nên chủ quan, bao gồm:</p><ul><li style="text-align: start;">Các bệnh lý ác tính như <a href="https://www.vinmec.com/vie/bai-viet/ung-thu-da-day-nguyen-nhan-trieu-chung-chan-doan-va-dieu-tri-vi" target="_blank">ung thư dạ dày</a>, ung thư tá tràng, ung thư trực tràng, ung thư đại tràng, u nhú ác tính,...</li><li style="text-align: start;">Các bệnh lý tiêu hóa lành tính như viêm loét dạ dày – tá tràng, viêm loét hang vị, <a href="https://www.vinmec.com/vie/bai-viet/benh-celiac-khong-dung-nap-gluten-la-gi-trieu-chung-va-nguyen-nhan-vi" target="_blank">bệnh celiac</a>, <a href="https://www.vinmec.com/vie/bai-viet/benh-viem-ruot-va-cac-pho-vi-khuan-duong-ruot-vi" target="_blank">bệnh viêm ruột</a>, nhiễm ký sinh trùng đường ruột,...</li><li style="text-align: start;"><a href="https://www.vinmec.com/vie/bai-viet/polyp-da-day-la-gi-nguyen-nhan-va-cach-dieu-tri-vi" target="_blank">Polyp ở dạ dày</a> hoặc đại trực tràng.</li></ul><p style="text-align: start;"><br></p><h1 style="text-align: start;" id="4-phuong-phap-xu-ly-truong-hop-trao-nguoc-da-day-g"><span style="font-size: 19px;"><strong>4. Phương pháp xử lý trường hợp trào ngược dạ dày gây sụt cân</strong></span></h1><p style="text-align: start;">Đầu tiên, đối với bệnh trào ngược dạ dày thực quản, người bệnh có thể điều chỉnh chế độ ăn uống và lối sống khoa học để cải thiện tình trạng bệnh. Việc duy trì một chế độ ăn nhẹ, dễ tiêu và hạn chế các thức ăn kích thích (như thực phẩm cay, chua, hoặc nhiều dầu mỡ) sẽ giúp giảm triệu chứng trào ngược. Bên cạnh đó, cần tránh ăn quá no và nằm ngay sau bữa ăn. Nếu các triệu chứng không cải thiện hoặc ngày càng nghiêm trọng hơn, người bệnh cần đến khám tại các cơ sở y tế chuyên khoa tiêu hóa để được chẩn đoán và điều trị đúng phác đồ.</p><p style="text-align: start;">Cần cẩn trọng chú ý, khi <span style="font-size: 16px;"><strong>trào ngược dạ dày gây sụt cân</strong></span> nhanh một cách bất thường, đặc biệt là ở người cao tuổi, người bệnh cần được khám ngay lập tức. Trong các trường hợp này, bác sĩ thường chỉ định thực hiện các xét nghiệm cần thiết và có thể yêu cầu <a href="https://www.vinmec.com/vie/bai-viet/noi-soi-da-day-co-may-cach-duoc-thuc-hien-nhu-nao-vi" target="_blank">nội soi dạ dày</a>, đại tràng để kiểm tra toàn diện <a href="https://www.vinmec.com/vie/bai-viet/he-tieu-hoa-hoat-dong-nao-vi" target="_blank">hệ tiêu hóa</a> nhằm xác định nguyên nhân chính xác gây ra tình trạng sụt cân.</p><p style="text-align: start;"><img src="https://res.cloudinary.com/dctzo9scu/image/upload/v1763988898/healthsystem/uploads/3982dd249b24245d75f4983a69f19e12.jpg" alt="" data-href="" style=""></p><p style="text-align: center;"><span style="color: rgb(51, 51, 51); font-size: 12px;">Người bệnh trào ngược dạ dày gây sụt cân nhanh bất thường cần chủ động đi khám tại các cơ sở y tế ngay lập tức, đặc biệt là đối với người cao tuổi.</span></p><p style="text-align: start;">Sụt cân bất thường ở người cao tuổi là dấu hiệu cảnh báo các bệnh lý nghiêm trọng và làm tăng nguy cơ tử vong. Do đó, người cao tuổi cần đặc biệt lưu ý và chủ động thăm khám ngay khi có các dấu hiệu bất thường để phát hiện sớm cũng như điều trị kịp thời.</p><p style="text-align: start;">Mặc dù <span style="font-size: 16px;"><strong>trào ngược dạ dày gây sụt cân</strong></span> không phải là biểu hiện phổ biến nhưng đây lại là dấu hiệu cảnh báo nguy hiểm mà người bệnh không thể chủ quan. Mỗi người nên xây dựng một chế độ ăn uống khoa học, duy trì lối sống lành mạnh và kiểm tra sức khỏe định kỳ. Đây là những biện pháp phòng ngừa bệnh trào ngược dạ dày thực quản cũng như các bệnh lý tiêu hóa khác hiệu quả nhất.</p>', 'Trào ngược dạ dày gây sụt cân là một triệu chứng cần được chú ý, vì đây có thể là dấu hiệu cảnh báo các vấn đề nghiêm trọng, cần được chẩn đoán và điều trị kịp thời để tránh những biến chứng nguy hiểm. Đặc biệt, bệnh trào ngược dạ dày thực quản rất phổ biến với tỷ lệ mắc bệnh ở người trưởng thành dao động từ 10-20%.', 'trao-nguoc-da-day-gay-sut-can-nguy-hiem-nhu-the-nao', 'https://res.cloudinary.com/dctzo9scu/image/upload/v1763989271/healthsystem/articles/thumbnails/8adfac1a787f7a22811f8891cccb438a.jpg', '{https://res.cloudinary.com/dctzo9scu/image/upload/v1763988484/healthsystem/uploads/8adfac1a787f7a22811f8891cccb438a.jpg,https://res.cloudinary.com/dctzo9scu/image/upload/v1763988582/healthsystem/uploads/855ae57689044512b294cb9d031000a6.jpg,https://res.cloudinary.com/dctzo9scu/image/upload/v1763988898/healthsystem/uploads/3982dd249b24245d75f4983a69f19e12.jpg}', 6, '2025-11-24 13:01:40.977', '2026-01-10 17:10:09.516', NULL, '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'f7b28932-5ba2-4769-9963-0dcd5bcec68e', 'pending_review', true, NULL, '[{"id": "1-trao-nguoc-da-day-thuc-quan-la-benh-gi", "label": "1. Trào ngược dạ dày thực quản là bệnh gì?", "level": 1}, {"id": "2-trieu-chung-benh-trao-nguoc-da-day-thuc-quan", "label": "2. Triệu chứng bệnh trào ngược dạ dày thực quản", "level": 1}, {"id": "21-o-chua", "label": "2.1 Ợ chua", "level": 2}, {"id": "22-o-hoi", "label": "2.2 Ợ hơi", "level": 2}, {"id": "23-non-oi-buon-non", "label": "2.3 Nôn ói, buồn nôn", "level": 2}, {"id": "24-an-khong-ngon-chan-an-kho-nuot", "label": "2.4 Ăn không ngon, chán ăn, khó nuốt", "level": 2}, {"id": "25-ho-viem-hong-tiet-nhieu-nuoc-bot-khan-giong", "label": "2.5 Ho, viêm họng, tiết nhiều nước bọt, khản giọng", "level": 2}, {"id": "3-trao-nguoc-da-day-gay-sut-can-co-nguy-hiem-khong", "label": "3. Trào ngược dạ dày gây sụt cân có nguy hiểm không?", "level": 1}, {"id": "31-khi-nao-trao-nguoc-da-day-gay-sut-can", "label": "3.1. Khi nào trào ngược dạ dày gây sụt cân?", "level": 2}, {"id": "32-canh-bao-benh-ly-tieu-hoa-khac-khi-gap-trao-ngu", "label": "3.2. Cảnh báo bệnh lý tiêu hóa khác khi gặp trào ngược dạ dày sụt cân", "level": 2}, {"id": "4-phuong-phap-xu-ly-truong-hop-trao-nguoc-da-day-g", "label": "4. Phương pháp xử lý trường hợp trào ngược dạ dày gây sụt cân", "level": 1}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('bcb382ca-caa8-42f1-be30-b457d1599478', 'Bài viết về Ung thư và ung bướu 4', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ung-thu-va-ung-buou-4', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '4d42d0a9-feff-4459-90ce-f143a233e874', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('e37e9bc1-31c2-41dd-bc9a-7a5135c054c1', 'Điều trị cúm đúng cách', '<p><span style="color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);">Cúm mùa là bệnh nhiễm trùng đường hô hấp cấp tính do virus cúm gây ra, có khả năng lây lan rất nhanh trong cộng đồng.</span></p><p style="text-align: start;"><span style="color: rgb(0, 0, 0);">Không ít người lầm tưởng cúm chỉ là "cảm lạnh thông thường", song thực tế, nếu không được theo dõi và điều trị đúng cách, cúm có thể gây ra nhiều biến chứng nghiêm trọng.</span></p><p style="text-align: start;"><br></p><p><span style="color: rgb(0, 0, 0);">Cúm mùa là bệnh nhiễm trùng đường hô hấp cấp tính do virus cúm gây ra, có khả năng lây lan rất nhanh trong cộng đồng. Virus dễ dàng phát tán qua các giọt bắn khi người bệnh ho, hắt hơi, nói chuyện hoặc cười.</span></p><p><span style="color: rgb(0, 0, 0);">Ngoài ra, virus cúm có thể tồn tại trên bề mặt đồ vật như tay nắm cửa, bàn ghế, điện thoại… Khi người khỏe mạnh chạm vào và vô tình đưa tay lên mũi, miệng, mắt, mầm bệnh có thể xâm nhập và gây nhiễm.</span></p><h3 id="dau-hieu-nhan-biet-cum-mua"><span style="color: rgb(0, 0, 0);">Dấu hiệu nhận biết cúm mùa</span></h3><p><span style="color: rgb(0, 0, 0);">Tại Việt Nam, cúm mùa chủ yếu do các chủng A/H3N2, A/H1N1 và cúm B gây ra. Theo Tổ chức Y tế Thế giới (WHO), mỗi năm cúm mùa có thể khiến từ 290.000 đến 650.000 người không qua khỏi trên toàn cầu, với khoảng 20% dân số có thể bị lây nhiễm, tùy thuộc vào chủng virus đang lưu hành.</span></p><p><span style="color: rgb(0, 0, 0);">Tác nhân gây bệnh là Myxovirus influenzae, thuộc họ Orthomyxoviridae. Trong đó, cúm A có thể lây từ người sang người và từ động vật như lợn, chim, ngựa; còn cúm B và C chỉ gây bệnh ở người.</span></p><p><span style="color: rgb(0, 0, 0);">Bệnh thường khởi phát đột ngột với các triệu chứng đặc trưng như:</span></p><ul><li><span style="color: rgb(0, 0, 0);">Sốt, ớn lạnh</span></li><li><span style="color: rgb(0, 0, 0);">Đau họng, ho khan</span></li><li><span style="color: rgb(0, 0, 0);">Hắt hơi, chảy mũi hoặc nghẹt mũi</span></li><li><span style="color: rgb(0, 0, 0);">Đau đầu, đau mỏi cơ khớp</span></li><li><span style="color: rgb(0, 0, 0);">Mệt mỏi, uể oải toàn thân</span></li></ul><p><span style="color: rgb(0, 0, 0);">Phần lớn các trường hợp cúm nhẹ có thể tự khỏi sau vài ngày nghỉ ngơi, nhưng người bệnh vẫn cần theo dõi sát vì bệnh có thể chuyển nặng nhanh, đặc biệt ở nhóm nguy cơ.</span></p><p><span style="color: rgb(0, 0, 0);">Không ít người lầm tưởng cúm chỉ là "cảm lạnh thông thường", song thực tế, nếu không được theo dõi và điều trị đúng cách, cúm có thể gây ra nhiều biến chứng nghiêm trọng như viêm phổi, viêm phế quản, viêm tai giữa hoặc làm nặng thêm các bệnh mạn tính như hen phế quản, tim mạch, COPD.</span></p><p><span style="color: rgb(0, 0, 0);">Trong trường hợp nặng, bệnh có thể dẫn tới suy hô hấp, thậm chí không qua khỏi, đặc biệt ở trẻ nhỏ, người cao tuổi, phụ nữ mang thai và người có bệnh nền.</span></p><p><img src="https://photo.znews.vn/w660/Uploaded/gtnvzv/2025_11_10/cum.jpg" alt="" data-href="" style=""></p><h3 id="djieu-tri-cum-djung-cach"><span style="color: rgb(0, 0, 0);">Điều trị cúm đúng cách</span></h3><p><span style="color: rgb(0, 0, 0);">Hầu hết bệnh nhân cúm chỉ cần điều trị triệu chứng tại nhà, không nên lạm dụng kháng sinh. Người bệnh nên nghỉ ngơi đầy đủ, giữ ấm cơ thể, uống nhiều nước, bổ sung dinh dưỡng và dùng paracetamol khi sốt hoặc đau nhức. Khi sốt cao, có thể lau người, chườm ấm để hạ nhiệt. Tuyệt đối không tự ý sử dụng kháng sinh hoặc thuốc kháng virus nếu chưa có chỉ định của bác sĩ.</span></p><p><span style="color: rgb(0, 0, 0);">Nếu triệu chứng kéo dài trên 7 ngày, sốt cao không hạ, khó thở hoặc mệt nhiều, người bệnh cần đến cơ sở y tế để được thăm khám, xử trí kịp thời. Đặc biệt, nhóm người trên 65 tuổi, trẻ nhỏ dưới 2 tuổi, phụ nữ mang thai hoặc người mắc bệnh mạn tính cần tuân thủ điều trị và nhập viện khi có chỉ định.</span></p><p><span style="color: rgb(0, 0, 0);">Phòng bệnh luôn là biện pháp hiệu quả nhất. Mỗi người nên che miệng và mũi khi ho, hắt hơi bằng khăn giấy, khăn vải hoặc ống tay áo, không khạc nhổ bừa bãi. Khi đến nơi đông người hoặc không gian kín, cần đeo khẩu trang đúng cách. Việc rửa tay thường xuyên bằng xà phòng hoặc dung dịch sát khuẩn cũng giúp giảm nguy cơ lây nhiễm.</span></p><p><span style="color: rgb(0, 0, 0);">Ngoài ra, cần hạn chế tiếp xúc gần với người mắc cúm, tiêm vaccine phòng cúm định kỳ mỗi năm, đặc biệt là với nhóm nguy cơ cao như trẻ nhỏ, người cao tuổi, nhân viên y tế và người có bệnh mạn tính. Duy trì lối sống lành mạnh, ăn uống đầy đủ, ngủ đủ giấc và tập thể dục đều đặn sẽ giúp tăng cường sức đề kháng, giảm nguy cơ mắc bệnh.</span></p><p><span style="color: rgb(0, 0, 0);">Khi có biểu hiện ho, sốt, sổ mũi, đau đầu hoặc mệt mỏi, người dân không nên tự mua thuốc hoặc xét nghiệm tại nhà mà cần đến cơ sở y tế để được tư vấn, khám và điều trị đúng cách.</span></p><p><br></p>', 'Cúm mùa là bệnh nhiễm trùng đường hô hấp cấp tính do virus cúm gây ra, có khả năng lây lan rất nhanh trong cộng đồng.', 'dieu-tri-cum-dung-cach', 'https://res.cloudinary.com/dctzo9scu/image/upload/v1763481803/healthsystem/articles/thumbnails/83364a2b2809f9c5d2303e87dfa35126.jpg', '{https://photo.znews.vn/w660/Uploaded/gtnvzv/2025_11_10/cum.jpg}', 19, '2025-11-18 16:03:38.774', '2025-11-24 08:10:06.197', '2025-11-18 16:03:38.766', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '1ef234e8-6486-43a1-8fb7-65fe93349f99', 'pending_review', true, NULL, NULL, NULL, NULL);
INSERT INTO public.health_articles VALUES ('b9e8528c-6920-4cd0-92b5-c540cc5c6186', 'Điều trị cúm đúng cách', '<p><span style="color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);">Cúm mùa là bệnh nhiễm trùng đường hô hấp cấp tính do virus cúm gây ra, có khả năng lây lan rất nhanh trong cộng đồng.</span></p><p style="text-align: start;"><span style="color: rgb(0, 0, 0);">Không ít người lầm tưởng cúm chỉ là "cảm lạnh thông thường", song thực tế, nếu không được theo dõi và điều trị đúng cách, cúm có thể gây ra nhiều biến chứng nghiêm trọng.</span></p><p><span style="color: rgb(0, 0, 0);">Cúm mùa là bệnh nhiễm trùng đường hô hấp cấp tính do virus cúm gây ra, có khả năng lây lan rất nhanh trong cộng đồng. Virus dễ dàng phát tán qua các giọt bắn khi người bệnh ho, hắt hơi, nói chuyện hoặc cười.</span></p><p><span style="color: rgb(0, 0, 0);">Ngoài ra, virus cúm có thể tồn tại trên bề mặt đồ vật như tay nắm cửa, bàn ghế, điện thoại… Khi người khỏe mạnh chạm vào và vô tình đưa tay lên mũi, miệng, mắt, mầm bệnh có thể xâm nhập và gây nhiễm.</span></p><h2 id="dau-hieu-nhan-biet-cum-mua"><span style="color: rgb(0, 0, 0);"><strong>Dấu hiệu nhận biết cúm mùa</strong></span></h2><p><span style="color: rgb(0, 0, 0);">Tại Việt Nam, cúm mùa chủ yếu do các chủng A/H3N2, A/H1N1 và cúm B gây ra. Theo Tổ chức Y tế Thế giới (WHO), mỗi năm cúm mùa có thể khiến từ 290.000 đến 650.000 người không qua khỏi trên toàn cầu, với khoảng 20% dân số có thể bị lây nhiễm, tùy thuộc vào chủng virus đang lưu hành.</span></p><p><span style="color: rgb(0, 0, 0);">Tác nhân gây bệnh là Myxovirus influenzae, thuộc họ Orthomyxoviridae. Trong đó, cúm A có thể lây từ người sang người và từ động vật như lợn, chim, ngựa; còn cúm B và C chỉ gây bệnh ở người.</span></p><p><span style="color: rgb(0, 0, 0);">Bệnh thường khởi phát đột ngột với các triệu chứng đặc trưng như:</span></p><ul><li><span style="color: rgb(0, 0, 0);">Sốt, ớn lạnh</span></li><li><span style="color: rgb(0, 0, 0);">Đau họng, ho khan</span></li><li><span style="color: rgb(0, 0, 0);">Hắt hơi, chảy mũi hoặc nghẹt mũi</span></li><li><span style="color: rgb(0, 0, 0);">Đau đầu, đau mỏi cơ khớp</span></li><li><span style="color: rgb(0, 0, 0);">Mệt mỏi, uể oải toàn thân</span></li></ul><p><span style="color: rgb(0, 0, 0);">Phần lớn các trường hợp cúm nhẹ có thể tự khỏi sau vài ngày nghỉ ngơi, nhưng người bệnh vẫn cần theo dõi sát vì bệnh có thể chuyển nặng nhanh, đặc biệt ở nhóm nguy cơ.</span></p><p><span style="color: rgb(0, 0, 0);">Không ít người lầm tưởng cúm chỉ là "cảm lạnh thông thường", song thực tế, nếu không được theo dõi và điều trị đúng cách, cúm có thể gây ra nhiều biến chứng nghiêm trọng như viêm phổi, viêm phế quản, viêm tai giữa hoặc làm nặng thêm các bệnh mạn tính như hen phế quản, tim mạch, COPD.</span></p><p><span style="color: rgb(0, 0, 0);">Trong trường hợp nặng, bệnh có thể dẫn tới suy hô hấp, thậm chí không qua khỏi, đặc biệt ở trẻ nhỏ, người cao tuổi, phụ nữ mang thai và người có bệnh nền.</span></p><p style="text-align: center;"><img src="https://photo.znews.vn/w660/Uploaded/gtnvzv/2025_11_10/cum.jpg" alt="" data-href="" style=""></p><h2 id="djieu-tri-cum-djung-cach"><span style="color: rgb(0, 0, 0);"><strong>Điều trị cúm đúng cách</strong></span></h2><p><span style="color: rgb(0, 0, 0);">Hầu hết bệnh nhân cúm chỉ cần điều trị triệu chứng tại nhà, không nên lạm dụng kháng sinh. Người bệnh nên nghỉ ngơi đầy đủ, giữ ấm cơ thể, uống nhiều nước, bổ sung dinh dưỡng và dùng paracetamol khi sốt hoặc đau nhức. Khi sốt cao, có thể lau người, chườm ấm để hạ nhiệt. Tuyệt đối không tự ý sử dụng kháng sinh hoặc thuốc kháng virus nếu chưa có chỉ định của bác sĩ.</span></p><p><span style="color: rgb(0, 0, 0);">Nếu triệu chứng kéo dài trên 7 ngày, sốt cao không hạ, khó thở hoặc mệt nhiều, người bệnh cần đến cơ sở y tế để được thăm khám, xử trí kịp thời. Đặc biệt, nhóm người trên 65 tuổi, trẻ nhỏ dưới 2 tuổi, phụ nữ mang thai hoặc người mắc bệnh mạn tính cần tuân thủ điều trị và nhập viện khi có chỉ định.</span></p><p><span style="color: rgb(0, 0, 0);">Phòng bệnh luôn là biện pháp hiệu quả nhất. Mỗi người nên che miệng và mũi khi ho, hắt hơi bằng khăn giấy, khăn vải hoặc ống tay áo, không khạc nhổ bừa bãi. Khi đến nơi đông người hoặc không gian kín, cần đeo khẩu trang đúng cách. Việc rửa tay thường xuyên bằng xà phòng hoặc dung dịch sát khuẩn cũng giúp giảm nguy cơ lây nhiễm.</span></p><p><span style="color: rgb(0, 0, 0);">Ngoài ra, cần hạn chế tiếp xúc gần với người mắc cúm, tiêm vaccine phòng cúm định kỳ mỗi năm, đặc biệt là với nhóm nguy cơ cao như trẻ nhỏ, người cao tuổi, nhân viên y tế và người có bệnh mạn tính. Duy trì lối sống lành mạnh, ăn uống đầy đủ, ngủ đủ giấc và tập thể dục đều đặn sẽ giúp tăng cường sức đề kháng, giảm nguy cơ mắc bệnh.</span></p><p><span style="color: rgb(0, 0, 0);">Khi có biểu hiện ho, sốt, sổ mũi, đau đầu hoặc mệt mỏi, người dân không nên tự mua thuốc hoặc xét nghiệm tại nhà mà cần đến cơ sở y tế để được tư vấn, khám và điều trị đúng cách.</span></p><p><br></p>', 'Cúm mùa là bệnh nhiễm trùng đường hô hấp cấp tính do virus cúm gây ra, có khả năng lây lan rất nhanh trong cộng đồng.', 'dieu-tri-cum-dung-cach-1', 'https://res.cloudinary.com/dctzo9scu/image/upload/v1763481803/healthsystem/articles/thumbnails/83364a2b2809f9c5d2303e87dfa35126.jpg', '{https://photo.znews.vn/w660/Uploaded/gtnvzv/2025_11_10/cum.jpg}', 45, '2025-11-18 16:18:15.571', '2026-01-10 16:45:23.568', '2025-11-21 14:52:43.494', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '1ef234e8-6486-43a1-8fb7-65fe93349f99', 'rejected', true, NULL, '[{"id": "dau-hieu-nhan-biet-cum-mua", "label": "Dấu hiệu nhận biết cúm mùa", "level": 2}, {"id": "djieu-tri-cum-djung-cach", "label": "Điều trị cúm đúng cách", "level": 2}]', NULL, 'Bài viết thiếu nội dung');
INSERT INTO public.health_articles VALUES ('5cd789fb-2cef-4723-b337-2c24639d6ca4', 'Bài viết về Ung thư và ung bướu 8', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ung-thu-va-ung-buou-8', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 101, '2025-10-01 12:00:00', '2025-11-24 12:41:01.616', '2025-10-01 12:00:00', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '4d42d0a9-feff-4459-90ce-f143a233e874', 'draft', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('02fa3ff3-00a2-4b19-ba3d-dbd031f7fcd4', 'Bài viết về Tim mạch 5', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tim-mach-5', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 112, '2025-10-01 12:00:00', '2025-11-11 13:22:49.878', '2025-10-01 12:00:00', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e7bc7eb5-d9d0-4b2c-b333-d71937a64818', 'reedited', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('7c0c7b89-6652-4ff2-a39d-da10a4f16d75', 'Bài viết về Tim mạch 14', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tim-mach-14', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 101, '2025-10-01 12:00:00', '2025-11-24 09:57:00.173', '2025-10-01 12:00:00', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e7bc7eb5-d9d0-4b2c-b333-d71937a64818', 'reedited', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', NULL);
INSERT INTO public.health_articles VALUES ('d0f93b32-89d2-4dab-a401-6fee71644b85', 'Bài viết về Hô hấp 4', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ho-hap-4', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '1ef234e8-6486-43a1-8fb7-65fe93349f99', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('a1733b95-b24e-44a9-95c2-fee4ff414750', 'Bài viết về Hô hấp 5', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ho-hap-5', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 102, '2025-10-01 12:00:00', '2026-01-10 16:00:34.485', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '1ef234e8-6486-43a1-8fb7-65fe93349f99', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('22a37340-7ee5-4f0c-b447-f9f858b3656e', 'Dấu hiệu chứng tỏ bạn đã nhiễm sán dây lợn', '<p><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);"><strong>Ăn nhiều vẫn gầy, rối loạn tiêu hóa, đi ngoài ra đốt trắng... đó có thể là tín hiệu sán dây lợn đang sống trong cơ thể.</strong></span></p><p style="text-align: center;"><img src="https://photo.znews.vn/w960/Uploaded/gtnvzv/2025_10_09/san_2_085954_091025_63.jpg" alt="" data-href="" style=""></p><p style="text-align: center;"><span style="color: rgb(136, 136, 136); background-color: rgb(255, 255, 255);">Nhiều nốt cản quang dưới da thành ngực - bụng của bệnh nhân do sán dây lợn. Ảnh: </span><span style="color: rgb(136, 136, 136); background-color: rgb(255, 255, 255);"><em>BVC</em></span><span style="color: rgb(136, 136, 136); background-color: rgb(255, 255, 255);">C</span></p><p>Theo PGS.TS.BS Phạm Ngọc Minh, khoa Vi sinh - Ký sinh trùng, Bệnh viện Đại học Y Hà Nội, bệnh sán dây lợn là một trong những bệnh truyền nhiễm phổ biến ở nước ta, do sán dây lợn (Taenia solium) gây ra. Người có thể mắc bệnh khi ăn phải thịt lợn chưa được nấu chín có chứa nang ấu trùng (lợn gạo).</p><h1 id="khi-mon-thit-tai-tro-thanh-cau-noi-cho-san-ky-sinh"><strong>Khi món thịt tái trở thành "cầu nối" cho sán ký sinh</strong></h1><p>Thịt lợn nhiễm ấu trùng sán nếu không được nấu chín kỹ, khi ăn vào sẽ đưa ấu trùng theo đường tiêu hóa xuống ruột non, phát triển thành sán trưởng thành. Loài sán này có thể dài từ 4 đến 6 mét, gồm hàng nghìn đốt, sống ký sinh trong ruột người.</p><p>Bác sĩ Phạm Ngọc Minh cho hay sán dây lợn sinh sản bằng cách tách các đốt già ở cuối cơ thể. Những đốt này được thải ra ngoài qua phân, mang theo hàng vạn trứng sán. Khi lợn ăn phải phân người nhiễm sán, trứng sẽ nở trong dạ dày, di chuyển qua máu đến các cơ, hình thành nang sán - hay còn gọi là lợn gạo.</p><p>Vòng đời khép kín đó khiến việc kiểm soát bệnh sán dây lợn trở nên phức tạp, đặc biệt ở những vùng ăn thịt tái, tiết canh, hoặc chưa có điều kiện vệ sinh tốt.</p><p style="text-align: center;"><img src="https://photo.znews.vn/w660/Uploaded/gtnvzv/2025_11_02/thit_tai.jpg" alt="" data-href="" style=""></p><p style="text-align: center;"><span style="color: rgb(136, 136, 136); background-color: rgb(255, 255, 255);">Nguy cơ nhiễm ký sinh trùng khi ăn thịt tái. Ảnh: </span><span style="color: rgb(136, 136, 136); background-color: rgb(255, 255, 255);"><em>sven_brandsma</em></span><span style="color: rgb(136, 136, 136); background-color: rgb(255, 255, 255);">.</span></p><h1 id="dau-hieu-nhan-biet-nhiem-san-day-lon"><strong>Dấu hiệu nhận biết nhiễm sán dây lợn</strong></h1><p>Theo PGS Minh, dấu hiệu đặc trưng nhất là đi ngoài ra những đốt sán màu trắng đục, có thể đứt khúc, di chuyển trong phân hoặc rơi ra ngoài hậu môn.</p><p>Ngoài ra, người bệnh có thể mệt mỏi, đau bụng âm ỉ, rối loạn tiêu hóa, ăn nhiều mà vẫn gầy, đôi khi buồn nôn hoặc mất ngủ.</p><p>Một dạng khác là bệnh "gạo người", khi trứng sán nở ra ấu trùng và di chuyển đến các cơ quan khác trong cơ thể. "Tùy vị trí ký sinh mà biểu hiện khác nhau. Nếu ở não, người bệnh có thể bị đau đầu, co giật, yếu liệt tay chân, rối loạn thị giác. Nếu ở cơ, có thể đau nhức, nổi cục nhỏ dưới da", bác sĩ Minh cho biết.</p><p>Để xác định bệnh, người bệnh cần xét nghiệm phân để tìm đốt sán hoặc trứng sán tại các cơ sở chuyên khoa ký sinh trùng. Việc tự ý mua thuốc xổ sán hoặc xét nghiệm máu tràn lan có thể dẫn đến sai lệch chẩn đoán, gây nguy hiểm.</p><p>Phác đồ điều trị hiện nay là dùng thuốc Praziquantel liều 15-20 mg/kg, uống một liều duy nhất theo chỉ định bác sĩ.</p><p>PGS Minh khuyến cáo phòng bệnh sán lợn không khó, quan trọng là giữ vệ sinh và ăn uống an toàn:</p><ul><ul><li>Ăn chín, uống sôi, tuyệt đối không ăn thịt lợn tái, nem chua hoặc tiết canh.</li><li>Rửa tay sạch trước khi ăn và sau khi đi vệ sinh.</li><li>Không dùng phân tươi bón rau, tránh để lợn tiếp xúc với phân người.</li><li>Kiểm soát nguồn thịt rõ ràng, không mua thịt có dấu hiệu nổi hạt trắng trong thớ thịt (nghi ngờ lợn gạo).</li></ul></ul><p>Máu là sức mạnh tự nhiên, là nguồn năng lượng quan trọng đã duy trì sự sống của chúng ta từ thời xa xưa. Bạn có thể không biết mình thuộc nhóm máu nào trừ khi bạn từng đi hiến máu hoặc cần truyền máu. Tại sao nhóm máu của chúng ta lại mạnh mẽ đến vậy? Vai trò thiết yếu của nhóm máu đối với sự tồn tại của chúng ta là gì - không chỉ trong hàng nghìn năm trước mà cho đến tận ngày nay?</p><p>Cuốn sách <a href="https://znews.vn/tam-quan-trong-cua-nhom-mau-post1419620.html" target=""><span style="background-color: transparent;"><em>Ăn theo nhóm máu</em></span></a> của BS Peter J D’Adamo gợi ý những chế độ ăn theo nhóm máu và những tác động đến sức khỏe, đời sống và tuổi thọ</p>', 'Thịt lợn nhiễm ấu trùng sán nếu không được nấu chín kỹ, khi ăn vào sẽ đưa ấu trùng theo đường tiêu hóa xuống ruột non, phát triển thành sán trưởng thành. Loài sán này có thể dài từ 4 đến 6 mét, gồm hàng nghìn đốt, sống ký sinh trong ruột người.', 'dau-hieu-chung-to-ban-da-nhiem-san-day-lon', 'https://res.cloudinary.com/dctzo9scu/image/upload/v1763732374/healthsystem/articles/thumbnails/4a03a9a5c88632f6b813b343360aa373.jpg', '{https://photo.znews.vn/w960/Uploaded/gtnvzv/2025_10_09/san_2_085954_091025_63.jpg,https://photo.znews.vn/w660/Uploaded/gtnvzv/2025_11_02/thit_tai.jpg}', 10, '2025-11-21 13:39:56.274', '2025-11-27 16:22:40.407', '2025-11-21 13:39:56.27', '3f3ab543-09d5-475b-8e57-366330d4f400', 'f7b28932-5ba2-4769-9963-0dcd5bcec68e', 'published', true, NULL, '[{"id": "khi-mon-thit-tai-tro-thanh-cau-noi-cho-san-ky-sinh", "label": "Khi món thịt tái trở thành \"cầu nối\" cho sán ký sinh", "level": 1}, {"id": "dau-hieu-nhan-biet-nhiem-san-day-lon", "label": "Dấu hiệu nhận biết nhiễm sán dây lợn", "level": 1}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('486c12a5-0b75-4dd1-8f29-19a449402c6b', 'Bài viết về Hô hấp 7', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ho-hap-7', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '1ef234e8-6486-43a1-8fb7-65fe93349f99', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('2f53b0b7-09f6-487f-b6e3-8826aaa26417', 'Bài viết về Tim mạch 10', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tim-mach-10', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 101, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e7bc7eb5-d9d0-4b2c-b333-d71937a64818', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('c0bb86e1-c0b9-40a4-be2d-686bdf962fba', 'Bài viết về Cơ xương khớp 2', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-co-xuong-khop-2', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 102, '2025-10-01 12:00:00', '2026-01-08 18:46:18.024', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '89c529a0-972d-48a5-984b-2f09ae82a95b', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('78ad36bd-8849-4f6d-866c-e6543afec215', 'Bài viết về Tim mạch 4', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tim-mach-4', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e7bc7eb5-d9d0-4b2c-b333-d71937a64818', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('a15a50f0-0ff9-49cd-be33-ce291710b82b', 'Bài viết về Tim mạch 11', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tim-mach-11', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e7bc7eb5-d9d0-4b2c-b333-d71937a64818', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('3a898648-c62c-4c56-aee5-e2334c4c2e49', 'Bài viết về Tim mạch 13', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tim-mach-13', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e7bc7eb5-d9d0-4b2c-b333-d71937a64818', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('61ec7ac0-9d7a-4648-be7e-d4909a468a13', 'Bài viết về Hô hấp 1', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ho-hap-1', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '1ef234e8-6486-43a1-8fb7-65fe93349f99', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('524944d9-2427-4734-8923-f7ad3ce9bf3b', 'Bài viết về ung thư', '<h1 id="che-djo-an-uong-lanh-manh-giup-tang-cuong-suc-dje-"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="1-bo-sung-djay-dju-vitamin-va-khoang-chat"><strong> 1. Bổ sung đầy đủ vitamin và khoáng chất</strong></h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="2-uong-dju-nuoc-moi-ngay"><strong> 2. Uống đủ nước mỗi ngày</strong></h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="3-han-che-thuc-pham-che-bien-san"><strong> 3. Hạn chế thực phẩm chế biến sẵn</strong></h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="4-an-uong-djieu-djo-va-djung-gio"><strong> 4. Ăn uống điều độ và đúng giờ</strong></h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="5-ket-hop-voi-loi-song-lanh-manh"><strong> 5. Kết hợp với lối sống lành mạnh</strong></h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ung-thu', 'https://res.cloudinary.com/dctzo9scu/image/upload/v1762364394/articles/thumbnails/d7821a263c534fd60a60fd9774ae75b0.jpg', '{https://res.cloudinary.com/dctzo9scu/image/upload/v1762364395/articles/images/d7821a263c534fd60a60fd9774ae75b0.jpg}', 35, '2025-11-05 17:51:54.953', '2025-12-29 04:12:24.499', '2025-11-21 14:58:44.22', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e7bc7eb5-d9d0-4b2c-b333-d71937a64818', 'published', true, '{}', '[{"id": "che-djo-an-uong-lanh-manh-giup-tang-cuong-suc-dje-", "label": " Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "1-bo-sung-djay-dju-vitamin-va-khoang-chat", "label": " 1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "2-uong-dju-nuoc-moi-ngay", "label": " 2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "3-han-che-thuc-pham-che-bien-san", "label": " 3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "4-an-uong-djieu-djo-va-djung-gio", "label": " 4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "5-ket-hop-voi-loi-song-lanh-manh", "label": " 5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('6cf80cce-b1fe-46d7-8f70-bc1fa15d039a', 'Bài viết về Hô hấp 6', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ho-hap-6', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '1ef234e8-6486-43a1-8fb7-65fe93349f99', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('5188f462-8a06-4d06-93f2-7fce1b7f26cc', 'Bài viết về Tim mạch 8', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tim-mach-8', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 117, '2025-10-01 12:00:00', '2026-01-10 15:54:58.729', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e7bc7eb5-d9d0-4b2c-b333-d71937a64818', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('802ce9e3-8dc7-461a-8dc7-e7dfd6479548', 'Bài viết về Hô hấp 3', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ho-hap-3', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '1ef234e8-6486-43a1-8fb7-65fe93349f99', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('f9b1778a-b1b1-4bef-8315-6685aacde233', 'Bài viết về Ung thư và ung bướu 13', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ung-thu-va-ung-buou-13', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '4d42d0a9-feff-4459-90ce-f143a233e874', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('bb0033e8-b93a-42ce-8a1f-7d775a81057e', 'Bài viết về Cơ xương khớp 8', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-co-xuong-khop-8', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '89c529a0-972d-48a5-984b-2f09ae82a95b', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('60d24c3a-c482-47a5-aa5e-808483fe42ab', 'Bài viết về Tiêu hóa 2', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tieu-hoa-2', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'f7b28932-5ba2-4769-9963-0dcd5bcec68e', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('6f2ecc4c-c971-4685-bd5f-86632b67f3ca', 'Bài viết về Tiêu hóa 3', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tieu-hoa-3', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'f7b28932-5ba2-4769-9963-0dcd5bcec68e', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('a2417acf-7948-4671-8951-5cdc889490ff', 'Bài viết về Tiêu hóa 7', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tieu-hoa-7', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'f7b28932-5ba2-4769-9963-0dcd5bcec68e', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('b2f85a40-66c5-45e2-8c4f-aecbfeb276d3', 'Bài viết về Hô hấp 9', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ho-hap-9', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '1ef234e8-6486-43a1-8fb7-65fe93349f99', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('79d000ff-2fab-4c07-b24e-2bb4832df24c', 'Bài viết về Tiêu hóa 10', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tieu-hoa-10', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'f7b28932-5ba2-4769-9963-0dcd5bcec68e', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('d2ff3af2-9cbb-4da5-ab59-e2a392b79f4f', 'Bài viết về Tiêu hóa 13', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tieu-hoa-13', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'f7b28932-5ba2-4769-9963-0dcd5bcec68e', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('9bd1d482-af06-4f68-8985-b235c11eeadd', 'Bài viết về Truyền nhiễm 9', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-truyen-nhiem-9', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '15203cc2-91a1-40cf-8973-ad02b227bbbb', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('6886e3ba-4f2c-44e4-ae4f-f20e4c451235', 'Bài viết về Dinh dưỡng 4', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-dinh-duong-4', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e4767f65-dbfc-4d76-8af6-1dd18e232975', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('c8d3b94b-d8f6-4412-a40b-08fdd29fc5e1', 'Bài viết về Dinh dưỡng 7', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-dinh-duong-7', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e4767f65-dbfc-4d76-8af6-1dd18e232975', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('2f572a5d-635f-42f8-a008-865a81678166', 'Bài viết về Hô hấp 11', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ho-hap-11', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '1ef234e8-6486-43a1-8fb7-65fe93349f99', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('cddb9b3b-b392-4017-aa7d-83bd2e9231d8', 'Bài viết về Dinh dưỡng 11', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-dinh-duong-11', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e4767f65-dbfc-4d76-8af6-1dd18e232975', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('9b252a49-f164-41a7-aa1c-29cb42e70fff', 'Hạn chế uống rượu, bia có độ cồn cao', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Uống rượu thường xuyên khiến tăng nguy cơ mắc bệnh cao huyết áp', 'han-che-uong-ruou-bia-co-do-con-cao', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 102, '2025-10-01 12:00:00', '2025-11-24 11:31:40.318', '2025-10-01 12:00:00', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e7bc7eb5-d9d0-4b2c-b333-d71937a64818', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('6360673d-64fc-4061-943b-e74224b4ee6c', 'Bài viết về Dinh dưỡng 13', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-dinh-duong-13', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e4767f65-dbfc-4d76-8af6-1dd18e232975', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('4d12d31e-f271-4fcc-ad84-0fe07e1b3cef', 'Bài viết về Thần kinh 2', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-than-kinh-2', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '2abfa60b-520e-432d-9cc3-b106f977911f', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('7afbc96f-5776-4606-82a0-7f685d15cec9', 'Bài viết về Thần kinh 5', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-than-kinh-5', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '2abfa60b-520e-432d-9cc3-b106f977911f', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('7c6f5a74-5936-46d2-b9b6-7e34e621786d', 'Bài viết về Thần kinh 8', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-than-kinh-8', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '2abfa60b-520e-432d-9cc3-b106f977911f', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('2f8c402d-2e39-400f-9104-4691ec6c99ec', 'Bài viết về Hô hấp 12', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ho-hap-12', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '1ef234e8-6486-43a1-8fb7-65fe93349f99', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('60c6c5f3-2516-4d02-9060-da4fd0f795a2', 'Bài viết về Hô hấp 13', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ho-hap-13', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '1ef234e8-6486-43a1-8fb7-65fe93349f99', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('70d0ccd1-407a-42b8-9042-1c72d7e34f7c', 'Bài viết về Tim mạch 1', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tim-mach-1', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e7bc7eb5-d9d0-4b2c-b333-d71937a64818', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('e0002399-e23c-457d-be41-5404e836862c', 'Bài viết về Thần kinh 12', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-than-kinh-12', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '2abfa60b-520e-432d-9cc3-b106f977911f', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('92a6919f-72ff-4027-b558-eeaac27aec71', 'Bài viết về Tim mạch 7', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tim-mach-7', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e7bc7eb5-d9d0-4b2c-b333-d71937a64818', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('ce812498-a311-4180-ae8b-e7f154482683', 'Bài viết về Hô hấp 14', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ho-hap-14', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '1ef234e8-6486-43a1-8fb7-65fe93349f99', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('cd01bc0e-9daa-4365-8692-6cf74b093642', 'Bài viết về Da liễu 0', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-da-lieu-0', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e0a2e156-9394-431f-8e15-48185bdeffde', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('3b7e3f17-3584-4f9f-ba19-f0dbc6e27bbd', 'Bài viết về Hô hấp 0', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ho-hap-0', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '1ef234e8-6486-43a1-8fb7-65fe93349f99', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('7defb169-a079-489a-bfd2-cf48ddf54066', 'Bài viết về Hô hấp 10', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ho-hap-10', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '1ef234e8-6486-43a1-8fb7-65fe93349f99', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('09e5471c-d65b-4623-a8bf-2fe3b0b8c35b', 'Bài viết về Da liễu 3', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-da-lieu-3', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e0a2e156-9394-431f-8e15-48185bdeffde', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('3b5a5547-0002-453b-8761-876320e210c7', 'Bài viết về Da liễu 2', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-da-lieu-2', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e0a2e156-9394-431f-8e15-48185bdeffde', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('e640adfa-823a-4c90-b8d7-1eefc8e86f01', 'Bài viết về Da liễu 4', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-da-lieu-4', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e0a2e156-9394-431f-8e15-48185bdeffde', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('0909c7a6-6de5-4257-8be5-3947a5f7e494', 'Bài viết về Ung thư và ung bướu 10', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ung-thu-va-ung-buou-10', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '4d42d0a9-feff-4459-90ce-f143a233e874', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('5c651470-b8fc-475c-a10f-cfdc6350d2d6', 'Bài viết về Cơ xương khớp 13', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-co-xuong-khop-13', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '89c529a0-972d-48a5-984b-2f09ae82a95b', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('81a2ff22-fb19-4dec-829d-e62dbd75991b', 'Bài viết về Tiêu hóa 6', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tieu-hoa-6', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'f7b28932-5ba2-4769-9963-0dcd5bcec68e', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('3a260fa4-abbf-4b54-82c1-266a21274f06', 'Bài viết về Da liễu 5', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-da-lieu-5', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e0a2e156-9394-431f-8e15-48185bdeffde', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('1f974837-5869-4b56-b711-050d67af928d', 'Bài viết về Da liễu 6', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-da-lieu-6', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e0a2e156-9394-431f-8e15-48185bdeffde', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('290780d2-6cf6-4836-b74d-8c56a593e3b7', 'Bài viết về Truyền nhiễm 4', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-truyen-nhiem-4', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 101, '2025-10-01 12:00:00', '2025-12-08 11:07:40.991', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '15203cc2-91a1-40cf-8973-ad02b227bbbb', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('9dd4f2c8-18c6-4678-8345-aefee17950b1', 'Bài viết về Truyền nhiễm 7', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-truyen-nhiem-7', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '15203cc2-91a1-40cf-8973-ad02b227bbbb', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('cdccb006-cf74-4a07-84cf-35b0bac46305', 'Bài viết về Thần kinh 13', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-than-kinh-13', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '2abfa60b-520e-432d-9cc3-b106f977911f', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('9c7f593a-ed27-47b1-9e56-285abaabfc91', 'Bài viết về Da liễu 7', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-da-lieu-7', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e0a2e156-9394-431f-8e15-48185bdeffde', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('22be4902-a5e3-40cc-a907-281aa8491658', 'Bài viết về Da liễu 8', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-da-lieu-8', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e0a2e156-9394-431f-8e15-48185bdeffde', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('6b5d0e07-bfda-4e85-a3a4-32e0f40d6940', 'Bài viết về Da liễu 10', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-da-lieu-10', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e0a2e156-9394-431f-8e15-48185bdeffde', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('4aa9402d-b82c-4bd3-a8dd-b13f2291a891', 'Bài viết về Da liễu 12', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-da-lieu-12', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e0a2e156-9394-431f-8e15-48185bdeffde', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('8a062d84-14ba-46b3-80fd-99605c72dfe0', 'Bài viết về Da liễu 13', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-da-lieu-13', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e0a2e156-9394-431f-8e15-48185bdeffde', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('98ee621f-4deb-40fe-b3e7-fd507cb8169f', 'Bài viết về Da liễu 14', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-da-lieu-14', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e0a2e156-9394-431f-8e15-48185bdeffde', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('cffe82b7-3c7d-46e4-90e3-30f8201e3423', 'Bài viết về Ung thư và ung bướu 0', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ung-thu-va-ung-buou-0', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '4d42d0a9-feff-4459-90ce-f143a233e874', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('e065bdaf-e6ae-4d89-831a-8c9f4c49a7b5', 'Bài viết về Ung thư và ung bướu 2', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ung-thu-va-ung-buou-2', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '4d42d0a9-feff-4459-90ce-f143a233e874', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('caa34b16-f3eb-477b-bf81-c7d6c096a4a0', 'Bài viết về Ung thư và ung bướu 5', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ung-thu-va-ung-buou-5', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '4d42d0a9-feff-4459-90ce-f143a233e874', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('563ac519-b629-4fdf-a115-bee40cf14202', 'Bài viết về Ung thư và ung bướu 6', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ung-thu-va-ung-buou-6', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '4d42d0a9-feff-4459-90ce-f143a233e874', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('1ed6fab2-543a-4fed-acfc-0500bd278d00', 'Bài viết về Cơ xương khớp 0', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-co-xuong-khop-0', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '89c529a0-972d-48a5-984b-2f09ae82a95b', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('e9661ccc-a127-47ee-91f6-55515b5cdc0a', 'Bài viết về Cơ xương khớp 1', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-co-xuong-khop-1', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '89c529a0-972d-48a5-984b-2f09ae82a95b', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('a7cfbb1c-d708-48b0-be79-16f82cd7a887', 'Bài viết về Cơ xương khớp 3', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-co-xuong-khop-3', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '89c529a0-972d-48a5-984b-2f09ae82a95b', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('05613068-c526-40cd-b3d8-ccc2de0e672c', 'Bài viết về Cơ xương khớp 6', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-co-xuong-khop-6', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '89c529a0-972d-48a5-984b-2f09ae82a95b', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('8036de0f-8236-4e59-8a23-0289c43a8746', 'Bài viết về Cơ xương khớp 7', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-co-xuong-khop-7', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '89c529a0-972d-48a5-984b-2f09ae82a95b', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('c8551c6c-a8e7-488d-a776-2a30221d3a72', 'Bài viết về Cơ xương khớp 14', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-co-xuong-khop-14', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '89c529a0-972d-48a5-984b-2f09ae82a95b', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('6e5c81bc-d0c7-4f7e-8c00-e60eed209920', 'Bài viết về Tiêu hóa 0', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tieu-hoa-0', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'f7b28932-5ba2-4769-9963-0dcd5bcec68e', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('f973b230-714f-47d5-8068-cac98a943b84', 'Bài viết về Tiêu hóa 1', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tieu-hoa-1', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'f7b28932-5ba2-4769-9963-0dcd5bcec68e', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('0e2923e0-1c32-4d6b-aa1c-03df499b7569', 'Bài viết về Tiêu hóa 11', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tieu-hoa-11', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'f7b28932-5ba2-4769-9963-0dcd5bcec68e', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('a3237dd9-90a0-4a0d-a4a7-09460097f898', 'Bài viết về Truyền nhiễm 1', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-truyen-nhiem-1', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '15203cc2-91a1-40cf-8973-ad02b227bbbb', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('88bae3ff-6ae1-4f20-9152-be17ab525722', 'Bài viết về Truyền nhiễm 2', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-truyen-nhiem-2', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '15203cc2-91a1-40cf-8973-ad02b227bbbb', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('70057432-0555-417f-af1a-d7bde296132e', 'Bài viết về Truyền nhiễm 3', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-truyen-nhiem-3', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '15203cc2-91a1-40cf-8973-ad02b227bbbb', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('6e24696f-6de6-4642-aa5f-026bef58f9cd', 'Bài viết về Truyền nhiễm 5', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-truyen-nhiem-5', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '15203cc2-91a1-40cf-8973-ad02b227bbbb', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('14141207-6d88-4ba8-a50d-1ed0991f1d5a', 'Bài viết về Truyền nhiễm 8', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-truyen-nhiem-8', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '15203cc2-91a1-40cf-8973-ad02b227bbbb', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('b55f2e2d-072d-4245-8de8-43a53c2d54df', 'Bài viết về Truyền nhiễm 11', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-truyen-nhiem-11', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '15203cc2-91a1-40cf-8973-ad02b227bbbb', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('dd7e98af-478c-4505-9485-61a381151481', 'Bài viết về Truyền nhiễm 13', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-truyen-nhiem-13', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '15203cc2-91a1-40cf-8973-ad02b227bbbb', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('346a6d8b-1522-4e45-83b2-3e681e6e1130', 'Bài viết về Dinh dưỡng 1', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-dinh-duong-1', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e4767f65-dbfc-4d76-8af6-1dd18e232975', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('c48891a0-1cb5-4a48-9bb9-ecbe8b30c6a7', 'Bài viết về Dinh dưỡng 2', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-dinh-duong-2', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e4767f65-dbfc-4d76-8af6-1dd18e232975', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('bc8971e7-c579-48cb-add1-2570c78b3be2', 'Bài viết về Ung thư và ung bướu 7', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ung-thu-va-ung-buou-7', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '4d42d0a9-feff-4459-90ce-f143a233e874', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('2074bb72-d2a8-4bec-a0ad-beb20e6c66a1', 'Bài viết về Ung thư và ung bướu 9', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ung-thu-va-ung-buou-9', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '4d42d0a9-feff-4459-90ce-f143a233e874', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('83f3f152-2fad-4c1d-8b5f-bc2537302692', 'Bài viết về Ung thư và ung bướu 11', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ung-thu-va-ung-buou-11', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '4d42d0a9-feff-4459-90ce-f143a233e874', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('efe5f2d8-cf39-4d09-b75d-8b99625a236a', 'Bài viết về Ung thư và ung bướu 14', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ung-thu-va-ung-buou-14', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '4d42d0a9-feff-4459-90ce-f143a233e874', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('d9d965dc-17fb-45f3-99a8-9b5fe8105b7b', 'Chế độ ăn tốt cho tim mạch: Các bước để ngăn ngừa bệnh tim', '<p style="text-align: start;">Việc tiêu thụ một số loại thực phẩm có thể làm tăng nguy cơ mắc <span style="font-size: 16px;"><strong>bệnh tim</strong></span>. Bằng cách tìm hiểu xem nên ăn nhiều loại thực phẩm nào và nên hạn chế những loại thực phẩm nào, bạn sẽ sớm có một chế độ ăn uống lành mạnh hơn cho tim của mình. </p><h1 style="text-align: start;" id="kiem-soat-khau-phan-an-giup-ngan-ngua-benh-tim"><span style="font-size: 19px;"><strong>Kiểm soát khẩu phần ăn giúp ngăn ngừa bệnh tim</strong></span><br></h1><p style="text-align: start;">Khối lượng thức ăn cũng quan trọng như loại thực phẩm bạn ăn. Việc ăn liên tục cho đến khi no có thể dẫn đến việc tiêu thụ nhiều calo hơn mức cần thiết dẫn đến <a href="https://www.vinmec.com/vie/bai-viet/nguyen-nhan-va-trieu-chung-cua--benh-tim-mach-vi" target="_blank"><span style="font-size: 16px;"><strong>bệnh tim</strong></span></a>, đặc biệt là những khẩu phần phục vụ tại các nhà hàng.<br>Một vài cách đơn giản để kiểm soát kích thước khẩu phần thực phẩm giúp cải thiện chế độ ăn uống cũng như sức khỏe tim mạch và cân nặng bao gồm:</p><ul><li style="text-align: start;">Sử dụng đĩa hoặc bát nhỏ để kiểm soát khẩu phần ăn.</li><li style="text-align: start;">Ăn nhiều thực phẩm ít calo, giàu dinh dưỡng như <a href="https://www.vinmec.com/vie/bai-viet/su-thu-vi-ve-trai-cay-va-cac-loai-rau-cu-vi" target="_blank">trái cây và rau củ</a>.</li><li style="text-align: start;">Ăn một lượng nhỏ thực phẩm nhiều calo và giàu <a href="https://www.vinmec.com/vie/bai-viet/kali-va-natri-co-vai-tro-nhu-nao-trong-che-do-cua-ban-vi" target="_blank">natri</a>.</li><li style="text-align: start;">Những thực phẩm này bao gồm thực phẩm tinh chế, chế biến sẵn và đồ ăn nhanh.</li></ul><h2 style="text-align: start;" id="lam-the-nao-dje-co-mot-khau-phan-an-phu-hopdje-co-"><strong>Làm thế nào để có một khẩu phần ăn phù hợp?</strong><br>Để có một khẩu phần ăn phù hợp, hãy ghi nhớ những điểm sau:</h2><ul><li style="text-align: start;">Kích thước khẩu phần là một lượng thực phẩm cụ thể. Nó được định nghĩa bởi các đơn vị đo lường phổ biến như gram hoặc miếng. Ví dụ, một khẩu phần mì ống là khoảng 40 đến 65 gram. Một khẩu phần thịt, cá hoặc gà là khoảng 30 đến 60 gram.</li><li style="text-align: start;">Số lượng khẩu phần được khuyến nghị trong mỗi nhóm thực phẩm có thể khác nhau. Nó phụ thuộc vào chế độ ăn cụ thể mà bạn đang theo.</li><li style="text-align: start;">Việc đánh giá khẩu phần ăn là một kỹ năng có thể học được. Bạn có thể cần sử dụng cốc và thìa đo lường hoặc cân ban đầu, dần bạn sẽ dễ dàng đo lường khẩu phần hơn.</li></ul><p style="text-align: start;"><br><span style="font-size: 19px;"><strong>Ăn nhiều rau củ và trái cây giúp ngăn ngừa bệnh tim</strong></span><br>Rau củ và trái cây là nguồn cung cấp <a href="https://www.vinmec.com/vie/bai-viet/vai-tro-cua-vitamin-va-khoang-chat-vi" target="_blank">vitamin và khoáng chất</a> tốt. Chúng cũng ít calo và giàu chất xơ. Rau củ và trái cây, giống như các loại thực phẩm từ thực vật khác, chứa các chất có thể giúp ngăn ngừa <span style="font-size: 16px;"><strong>bệnh tim</strong></span>. Ăn nhiều trái cây và rau củ cũng có thể giúp bạn hạn chế ăn những thực phẩm nhiều <a href="https://www.vinmec.com/vie/bai-viet/calo-khong-chi-la-con-so-vi" target="_blank">calo</a> hơn như: thịt, phô mai hay đồ ăn vặt.</p><p style="text-align: start;">Việc bổ sung rau củ và trái cây trong chế độ ăn uống của bạn có thể rất dễ dàng: rửa sạch và cắt nhỏ rau củ trước khi cho vào tủ lạnh để có thể ăn nhẹ hoặc nấu những món có rau củ hoặc trái cây là nguyên liệu chính như các món xào và salad.</p><p style="text-align: center;"><img src="https://www.vinmec.com/static/uploads/small_20200720_171928_750917_sai_lam_khi_rua_rau_max_1800x1800_jpg_9e620a19eb.jpg" alt="" data-href="" style="width: 737.00px;height: 459.88px;"></p><p style="text-align: center;"><span style="color: rgb(51, 51, 51); background-color: rgb(247, 247, 247); font-size: 12px;">Rau củ và trái cây là nguồn cung cấp vitamin và khoáng chất tốt.</span></p><p style="text-align: start;"><span style="font-size: 19px;"><strong>Chọn ngũ cốc nguyên hạt</strong></span><br><a href="https://www.vinmec.com/vie/bai-viet/ngu-coc-nguyen-hat-tot-nhu-nao-vi" target="_blank">Ngũ cốc nguyên hạt</a> là nguồn cung cấp chất xơ và các dưỡng chất khác có vai trò trong sức khỏe tim mạch, giảm nguy cơ mắc <span style="font-size: 16px;"><strong>bệnh tim</strong></span> và kiểm soát huyết áp. Bạn có thể tăng cường ngũ cốc nguyên hạt bằng cách thay thế các sản phẩm <a href="https://www.vinmec.com/vie/bai-viet/su-khac-nhau-giua-ngu-coc-nguyen-hat-voi-ngu-coc-tinh-che-va-ngu-coc-thuong-vi" target="_blank">ngũ cốc tinh chế</a>. Hoặc thử một loại ngũ cốc nguyên hạt mà bạn chưa từng ăn trước đây. Những lựa chọn tốt bao gồm farro nguyên hạt, diêm mạch và lúa mạch. Ít nhất một nửa lượng ngũ cốc bạn ăn nên là ngũ cốc nguyên hạt.</p><p style="text-align: start;"><span style="font-size: 19px;"><strong>Hạn chế chất béo không lành mạnh giúp ngăn ngừa bệnh tim</strong></span><br>Hạn chế lượng chất béo bão hòa và chất béo chuyển hóa mà bạn tiêu thụ. Điều này giúp giảm <a href="https://www.vinmec.com/vie/bai-viet/tat-ca-nhung-dieu-can-biet-ve-cholesterol-vi" target="_blank">cholesterol</a> trong máu và giảm nguy cơ mắc <span style="font-size: 16px;"><strong>bệnh tim</strong></span> phổ biến gọi là <a href="https://www.vinmec.com/vie/bai-viet/benh-mach-vanh-bieu-hien-nguyen-nhan-va-cach-dieu-tri-o-vinmec-vi" target="_blank">bệnh động mạch vành</a>. Mức cholesterol trong máu cao có thể dẫn đến sự tích tụ các mảng bám trong động mạch, gọi là <a href="https://www.vinmec.com/vie/benh/xo-vua-dong-mach-3030" target="_blank">xơ vữa động mạch</a>. Và điều đó có thể làm tăng nguy cơ nhồi máu cơ tim và đột quỵ.<br>Có những cách đơn giản để giảm bớt chất béo bão hòa và chất béo chuyển hóa cho một chế độ ăn uống tốt cho tim:</p><ul><li style="text-align: start;">Cắt bỏ mỡ từ thịt hoặc chọn thịt nạc có ít hơn 10% mỡ.</li><li style="text-align: start;">Sử dụng ít bơ, bơ thực vật và mỡ trừu khi nấu ăn và phục vụ.</li><li style="text-align: start;">Sử dụng các lựa chọn thay thế ít béo khi có thể. Ví dụ, sử dụng trái cây nguyên miếng hoặc mứt trái cây ít đường trên bánh mì nướng thay vì bơ thực vật.</li></ul><p style="text-align: start;">Kiểm tra nhãn thực phẩm của bánh quy, bánh ngọt, kem phủ, bánh quy giòn và khoai tây chiên. Những thực phẩm này có giá trị dinh dưỡng thấp. Và một số trong số chúng, ngay cả những loại được ghi là ít béo, cũng có thể chứa <a href="https://www.vinmec.com/vie/bai-viet/vi-sao-chat-beo-chuyen-hoa-co-hai-vi" target="_blank">chất béo chuyển hóa</a>. Chất béo chuyển hóa có thể được liệt kê là dầu hydrogen hóa trên nhãn thành phần. Ngoài ra, nhiều chất béo hydrogen hóa hoặc chất béo chuyển hóa trong các món tráng miệng và đồ ăn vặt được thay thế bằng chất béo bão hòa. Vì vậy, hạn chế những thực phẩm này sẽ giúp giảm nguy cơ mắc <span style="font-size: 16px;"><strong>bệnh tim</strong></span>.</p><p style="text-align: start;"><span style="font-size: 19px;"><strong>Chọn các nguồn protein ít béo giúp ngăn ngừa bệnh tim</strong></span><br>Thịt nạc, gia cầm và cá hay các sản phẩm từ sữa ít béo hoặc không béo và trứng là một số nguồn protein tốt nhất. Hãy chọn các lựa chọn ít béo hơn, chẳng hạn như ức gà không da thay vì bánh gà rán. Và chọn sữa tách béo thay vì sữa nguyên chất.<br>Cá là lựa chọn lành mạnh hơn so với các loại thịt có hàm lượng chất béo cao. Một số loại cá nhất định rất giàu <a href="https://www.vinmec.com/vie/bai-viet/axit-beo-omega-3-la-gi-vi" target="_blank">axit béo omega-3</a>, có thể làm giảm chất béo trong máu được gọi là triglycerides. Bạn sẽ tìm thấy lượng axit béo omega-3 cao nhất trong các loại cá sống ở vùng lạnh, chẳng hạn như cá hồi, cá thu và cá trích. Các nguồn khác bao gồm hạt lanh, quả óc chó, đậu nành và dầu cải.<br>Các loại đậu như đậu Hà Lan và đậu lăng cũng là nguồn protein ít béo tốt. Chúng không chứa cholesterol và có thể thay thế tốt cho thịt. Việc tiêu thụ protein thực vật thay cho protein động vật không chỉ giúp giảm lượng chất béo và cholesterol, nhằm tránh mắc <span style="font-size: 16px;"><strong>bệnh tim</strong></span> mà còn tăng cường lượng <a href="https://www.vinmec.com/vie/bai-viet/vai-tro-cua-chat-xo-voi-co-vi" target="_blank">chất xơ</a> mà bạn nhận được.</p><p style="text-align: start;"><img src="https://www.vinmec.com/static/uploads/large_dau_xuong_khop_va_thit_ga_5fbe338441.jpg" alt="" data-href="" style=""></p><p style="text-align: start;"><span style="color: rgb(51, 51, 51); background-color: rgb(247, 247, 247); font-size: 12px;">Thịt nạc, gia cầm và cá hay các sản phẩm từ sữa ít béo hoặc không béo và trứng là một số nguồn protein tốt nhất.</span></p><h1 style="text-align: start;" id="han-che-va-giam-natri-va-muoi-giup-ngan-ngua-benh-"><span style="font-size: 19px;"><strong>Hạn chế và giảm natri và muối giúp ngăn ngừa bệnh tim</strong></span></h1><p style="text-align: start;"><br>Natri là một khoáng chất có trong một số thực phẩm như cần tây hoặc sữa. Các nhà sản xuất thực phẩm cũng có thể thêm natri vào các thực phẩm chế biến sẵn, chẳng hạn như bánh mì và súp. Ăn các thực phẩm có nhiều natri thêm vào có thể dẫn đến huyết áp cao. Việc sử dụng muối ăn, vốn chứa natri, cũng có thể gây ra điều này.<br>Huyết áp cao là một yếu tố nguy cơ gây <span style="font-size: 16px;"><strong>bệnh tim</strong></span>. Hạn chế muối và natri là một phần quan trọng trong chế độ ăn uống tốt cho tim. Hiệp hội Tim mạch Hoa Kỳ khuyến nghị rằng người lớn:</p><ul><li style="text-align: start;">Không tiêu thụ quá 2,300 miligam (mg) natri mỗi ngày. Điều này tương đương khoảng một muỗng cà phê muối.</li><li style="text-align: start;">Tốt nhất là không nên tiêu thụ quá 1,500 mg natri mỗi ngày.</li></ul><p style="text-align: start;">Hạn chế lượng muối bạn thêm vào thực phẩm khi ăn tại bàn hoặc khi nấu ăn là một bước khởi đầu tốt. Nhưng nhiều natri bạn tiêu thụ đến từ thực phẩm đóng hộp hoặc chế biến sẵn. Những thực phẩm này bao gồm súp, bánh nướng và bữa ăn đông lạnh. Hãy ăn thực phẩm tươi hoặc tự làm súp và món hầm để giảm lượng natri bạn tiêu thụ.<br>Một cách khác để ăn ít natri hơn là chọn gia vị một cách cẩn thận. Các gia vị thay thế muối có thể thêm hương vị cho thực phẩm của bạn với ít natri hơn.</p><h1 style="text-align: start;" id="tao-thuc-djon-hang-ngay-giup-ngan-ngua-benh-tim"><span style="font-size: 19px;"><strong>Tạo thực đơn hàng ngày giúp ngăn ngừa bệnh tim</strong></span></h1><p style="text-align: start;">Tạo thực đơn hàng ngày bằng cách sử dụng sáu điều đã được liệt kê ở trên. Khi bạn chọn thực phẩm cho mỗi bữa ăn và bữa ăn nhẹ, hãy tập trung vào rau, trái cây và ngũ cốc nguyên hạt, chọn protein nạc và chất béo lành mạnh, và hạn chế thực phẩm mặn. Theo dõi kích thước khẩu phần và thêm sự đa dạng vào lựa chọn thực đơn của bạn để có thể tận hưởng những món ăn đồng thời giảm nguy cơ mắc <span style="font-size: 16px;"><strong>bệnh tim</strong></span>.</p>', 'Việc tiêu thụ một số loại thực phẩm có thể làm tăng nguy cơ mắc bệnh tim. Bằng cách tìm hiểu xem nên ăn nhiều loại thực phẩm nào và nên', 'che-do-an-tot-cho-tim-mach-cac-buoc-de-ngan-ngua-benh-tim', 'https://res.cloudinary.com/dctzo9scu/image/upload/v1763953865/healthsystem/articles/thumbnails/fcfdda2bde9f400fa1eecd7bb8c8bfcb.jpg', '{https://www.vinmec.com/static/uploads/small_20200720_171928_750917_sai_lam_khi_rua_rau_max_1800x1800_jpg_9e620a19eb.jpg,https://www.vinmec.com/static/uploads/large_dau_xuong_khop_va_thit_ga_5fbe338441.jpg}', 9, '2025-11-24 03:11:34.24', '2025-11-27 16:24:57.816', '2025-11-24 03:11:34.235', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e7bc7eb5-d9d0-4b2c-b333-d71937a64818', 'reedited', true, NULL, '[{"id": "kiem-soat-khau-phan-an-giup-ngan-ngua-benh-tim", "label": "Kiểm soát khẩu phần ăn giúp ngăn ngừa bệnh tim", "level": 1}, {"id": "lam-the-nao-dje-co-mot-khau-phan-an-phu-hopdje-co-", "label": "Làm thế nào để có một khẩu phần ăn phù hợp?Để có một khẩu phần ăn phù hợp, hãy ghi nhớ những điểm sau:", "level": 2}, {"id": "han-che-va-giam-natri-va-muoi-giup-ngan-ngua-benh-", "label": "Hạn chế và giảm natri và muối giúp ngăn ngừa bệnh tim", "level": 1}, {"id": "tao-thuc-djon-hang-ngay-giup-ngan-ngua-benh-tim", "label": "Tạo thực đơn hàng ngày giúp ngăn ngừa bệnh tim", "level": 1}]', '4ed76fa3-ae06-47ab-94f3-d531a180b952', NULL);
INSERT INTO public.health_articles VALUES ('27e9cc5a-8ac4-4e52-a6d5-711d27c1a735', 'Bài viết về Cơ xương khớp 9', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-co-xuong-khop-9', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '89c529a0-972d-48a5-984b-2f09ae82a95b', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('1956d82e-c1cb-4f0e-9b15-fcb62d859ba3', 'Bài viết về Cơ xương khớp 11', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-co-xuong-khop-11', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '89c529a0-972d-48a5-984b-2f09ae82a95b', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('a36f38f4-e047-4a9a-ac8b-f28dd5440d15', 'Bài viết về Tim mạch 2', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tim-mach-2', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e7bc7eb5-d9d0-4b2c-b333-d71937a64818', 'draft', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('49835b1f-1a28-44c2-8413-246614a257e8', 'Bài viết về Tim mạch 3', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tim-mach-3', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 111, '2025-10-01 12:00:00', '2025-11-24 11:01:16.539', '2025-10-01 12:00:00', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e7bc7eb5-d9d0-4b2c-b333-d71937a64818', 'rejected', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, 'Bài viết thiếu nội dung.');
INSERT INTO public.health_articles VALUES ('44b81165-3d51-4892-a250-509427a2a67a', 'Bài viết về Tiêu hóa 5', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tieu-hoa-5', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'f7b28932-5ba2-4769-9963-0dcd5bcec68e', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('6e18e9b2-6eac-4ffa-b188-af9ae4c57768', 'Bài viết về Tiêu hóa 8', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tieu-hoa-8', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'f7b28932-5ba2-4769-9963-0dcd5bcec68e', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('738904c2-9927-489b-a865-e1d8fbb74420', 'Bài viết về Tiêu hóa 9', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tieu-hoa-9', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'f7b28932-5ba2-4769-9963-0dcd5bcec68e', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('e38bda1c-ffd5-4960-86a6-b0ceab4035b4', 'Bài viết về Dinh dưỡng 0', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-dinh-duong-0', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 103, '2025-10-01 12:00:00', '2025-11-24 09:21:51.25', '2025-11-24 09:21:51.247', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e4767f65-dbfc-4d76-8af6-1dd18e232975', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('662ccdf4-8b5c-4564-9510-39ff1732f654', 'Bài viết về Truyền nhiễm 0', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-truyen-nhiem-0', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '15203cc2-91a1-40cf-8973-ad02b227bbbb', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('b6fccd6c-28fe-4f14-a8f8-48d0fa37f863', 'Bài viết về Tim mạch 6', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tim-mach-6', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 119, '2025-10-01 12:00:00', '2025-11-24 10:02:07.054', '2025-10-01 12:00:00', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e7bc7eb5-d9d0-4b2c-b333-d71937a64818', 'pending_review', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('c2a37105-6cfe-489f-867f-f09bf697f23f', 'Bài viết về Truyền nhiễm 10', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-truyen-nhiem-10', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '15203cc2-91a1-40cf-8973-ad02b227bbbb', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('1759d039-92d1-4d7f-8e8c-9c244c05c19b', 'Bài viết về Ung thư và ung bướu 12', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ung-thu-va-ung-buou-12', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 101, '2025-10-01 12:00:00', '2025-11-24 11:32:29.538', '2025-10-01 12:00:00', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '4d42d0a9-feff-4459-90ce-f143a233e874', 'rejected', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('6ce64526-368a-416e-bbc1-396c84b6939a', 'Bài viết về Dinh dưỡng 3', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-dinh-duong-3', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e4767f65-dbfc-4d76-8af6-1dd18e232975', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('84dad335-d287-490a-b7df-f5ded20ad354', 'Bài viết về Dinh dưỡng 5', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-dinh-duong-5', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e4767f65-dbfc-4d76-8af6-1dd18e232975', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('92af7a8d-72ae-475a-8aa6-b38f21b80130', 'Bài viết về Dinh dưỡng 9', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-dinh-duong-9', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e4767f65-dbfc-4d76-8af6-1dd18e232975', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('e8a2f725-bf7e-4a70-9048-32f861a2e8dd', 'Bài viết về Dinh dưỡng 10', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-dinh-duong-10', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e4767f65-dbfc-4d76-8af6-1dd18e232975', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('9de9bbad-8882-47dd-a3f8-9ccaff579b1a', 'Bài viết về Dinh dưỡng 12', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-dinh-duong-12', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e4767f65-dbfc-4d76-8af6-1dd18e232975', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('9bd0ead4-438b-4c5e-8bd2-716395604bda', 'Bài viết về Thần kinh 0', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-than-kinh-0', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '2abfa60b-520e-432d-9cc3-b106f977911f', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('f4cf85e0-d102-427e-bef8-b0a07dd34c29', 'Bài viết về Thần kinh 3', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-than-kinh-3', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '2abfa60b-520e-432d-9cc3-b106f977911f', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('c2d12f45-c5a6-4963-acca-e51ea7e5ff25', 'Bài viết về Thần kinh 4', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-than-kinh-4', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '2abfa60b-520e-432d-9cc3-b106f977911f', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('370ee9bc-2158-450d-841f-63c8a2a1e122', 'Bài viết về Thần kinh 6', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-than-kinh-6', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '2abfa60b-520e-432d-9cc3-b106f977911f', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('c136e05e-2d56-4c99-b090-2577fa060746', 'Bài viết về Tim mạch 0', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tim-mach-0', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e7bc7eb5-d9d0-4b2c-b333-d71937a64818', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('5b8fffc4-4f6a-4555-a0bb-a0ec650913cf', 'Bài viết về Thần kinh 10', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-than-kinh-10', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '2abfa60b-520e-432d-9cc3-b106f977911f', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('74050cae-0716-47b7-8b8f-b688bd11f28f', 'Bài viết về Thần kinh 11', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-than-kinh-11', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '2abfa60b-520e-432d-9cc3-b106f977911f', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('02547812-38b8-4633-8606-4a364de309b1', 'Bài viết về Thần kinh 14', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-than-kinh-14', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '2abfa60b-520e-432d-9cc3-b106f977911f', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('f63b10d6-377a-480d-a001-cab922580cc2', 'Bài viết về Tim mạch 9', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tim-mach-9', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e7bc7eb5-d9d0-4b2c-b333-d71937a64818', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('61ab9048-b929-4d7a-8ac6-694b75600c63', 'Bài viết về Hô hấp 2', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ho-hap-2', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '1ef234e8-6486-43a1-8fb7-65fe93349f99', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('05eebd80-41aa-40a4-82ee-81e8614f0844', 'Bài viết về Hô hấp 8', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ho-hap-8', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '1ef234e8-6486-43a1-8fb7-65fe93349f99', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('64bcc30c-e954-4564-9e5f-efd0004f6e6c', 'Bài viết về Da liễu 1', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-da-lieu-1', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e0a2e156-9394-431f-8e15-48185bdeffde', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('fc1fc2ce-b76d-45bb-b6e3-4849eccc25b0', 'Bài viết về Da liễu 9', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-da-lieu-9', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e0a2e156-9394-431f-8e15-48185bdeffde', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('70ab6231-78f8-48e2-930d-5747fdd3d3f8', 'Bài viết về Da liễu 11', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-da-lieu-11', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e0a2e156-9394-431f-8e15-48185bdeffde', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('fc2a3bc5-d871-4850-b6ed-58cdc29865cd', 'Bài viết về Ung thư và ung bướu 1', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ung-thu-va-ung-buou-1', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '4d42d0a9-feff-4459-90ce-f143a233e874', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('87d391cb-dc6a-43a7-9831-25c73022fbef', 'Bài viết về Ung thư và ung bướu 3', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-ung-thu-va-ung-buou-3', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '4d42d0a9-feff-4459-90ce-f143a233e874', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('c07ebc0c-b093-47d0-bbe8-eebfc910aed6', 'Bài viết về Cơ xương khớp 4', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-co-xuong-khop-4', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '89c529a0-972d-48a5-984b-2f09ae82a95b', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('b412719e-8347-4113-8cfa-0baa99193b02', 'Bài viết về Cơ xương khớp 5', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-co-xuong-khop-5', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '89c529a0-972d-48a5-984b-2f09ae82a95b', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('bf18bb9d-246a-465f-8a29-fc5e0bb87132', 'Bài viết về Cơ xương khớp 10', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-co-xuong-khop-10', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '89c529a0-972d-48a5-984b-2f09ae82a95b', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('3635412f-81e3-44c3-9395-277b28421574', 'Bài viết về Cơ xương khớp 12', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-co-xuong-khop-12', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '89c529a0-972d-48a5-984b-2f09ae82a95b', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('aeb21e9a-50dd-486d-bd28-72bf4c96c2f7', 'Bài viết về Tiêu hóa 4', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tieu-hoa-4', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'f7b28932-5ba2-4769-9963-0dcd5bcec68e', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('438b1b90-524c-41ac-915e-08628a4674b0', 'Bài viết về Tiêu hóa 12', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tieu-hoa-12', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'f7b28932-5ba2-4769-9963-0dcd5bcec68e', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('8c446429-5f58-4d79-986d-fd8a4ca6faf4', 'Bài viết về Truyền nhiễm 12', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-truyen-nhiem-12', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 107, '2025-10-01 12:00:00', '2026-01-08 13:52:17.101', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '15203cc2-91a1-40cf-8973-ad02b227bbbb', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('398d9a79-e60f-4048-a208-715605fea7b1', 'Bài viết về Tiêu hóa 14', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-tieu-hoa-14', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 107, '2025-10-01 12:00:00', '2025-11-18 18:16:03.077', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'f7b28932-5ba2-4769-9963-0dcd5bcec68e', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('458b8809-38f9-47a2-aedc-de0e1b881b4f', 'Bài viết về Truyền nhiễm 6', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-truyen-nhiem-6', 'https://toplist.vn/images/800px/bai-tho-doi-ao-trang-nguyen-ngoc-rene-1046986.jpg', NULL, 101, '2025-10-01 12:00:00', '2025-11-18 17:30:47.881', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '15203cc2-91a1-40cf-8973-ad02b227bbbb', 'published', true, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('47968a7e-4646-4181-a1e4-ea9ac0c0d697', 'Bài viết về Dinh dưỡng 6', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-dinh-duong-6', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 100, '2025-10-01 12:00:00', '2025-10-27 08:32:56.41', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e4767f65-dbfc-4d76-8af6-1dd18e232975', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('2e913cda-8df9-41e8-aeb9-19698f0d669c', 'Bài viết về Dinh dưỡng 14', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-dinh-duong-14', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 102, '2025-10-01 12:00:00', '2025-11-18 19:05:20.585', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', 'e4767f65-dbfc-4d76-8af6-1dd18e232975', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('2f644f31-fd77-4e6d-b8fb-4532fe54e831', 'Bài viết về Thần kinh 1', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-than-kinh-1', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 112, '2025-10-01 12:00:00', '2025-11-24 08:09:33.25', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '2abfa60b-520e-432d-9cc3-b106f977911f', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);
INSERT INTO public.health_articles VALUES ('49f4e5b3-3039-4ad3-9a53-2f88805ead46', 'Bài viết về Thần kinh 7', '<h1 id="che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang"> Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng</h1><p> Một chế độ ăn uống khoa học không chỉ giúp duy trì cân nặng hợp lý mà còn tăng cường hệ miễn dịch, giúp cơ thể phòng chống bệnh tật tốt hơn. Dưới đây là những nguyên tắc cơ bản bạn nên áp dụng hằng ngày.</p><h2 id="bo-sung-day-du-vitamin-va-khoang-chat"> 1. Bổ sung đầy đủ vitamin và khoáng chất</h2><p><strong>Vitamin C, D, E</strong> cùng với các khoáng chất như <strong>kẽm</strong> và <strong>sắt</strong> đóng vai trò quan trọng trong việc bảo vệ cơ thể khỏi vi khuẩn và virus. Bạn nên bổ sung chúng thông qua rau xanh, trái cây tươi, cá, trứng và hạt.</p><ul><li><em>Cam, chanh, bưởi</em> giúp cung cấp nhiều vitamin C.</li><li><em>Cá hồi, trứng, sữa</em> là nguồn vitamin D tự nhiên.</li><li><em>Hạt bí, thịt bò, ngũ cốc nguyên hạt</em> chứa nhiều kẽm và sắt.</li></ul><h2 id="uong-du-nuoc-moi-ngay"> 2. Uống đủ nước mỗi ngày</h2><p> Nước chiếm khoảng <strong>70%</strong> trọng lượng cơ thể và là yếu tố thiết yếu cho mọi hoạt động sống. Thiếu nước khiến cơ thể mệt mỏi, da khô và giảm khả năng miễn dịch. Người trưởng thành nên uống <strong>2–2.5 lít nước mỗi ngày</strong>.</p><h2 id="han-che-thuc-pham-che-bien-san"> 3. Hạn chế thực phẩm chế biến sẵn</h2><p> Thực phẩm chế biến sẵn thường chứa nhiều muối, đường, chất béo bão hòa và chất bảo quản, có thể làm suy giảm hệ miễn dịch nếu sử dụng lâu dài. Hãy ưu tiên các món ăn <em>tươi sống, ít gia vị, nấu tại nhà</em> để bảo vệ sức khỏe.</p><h2 id="an-uong-dieu-do-va-dung-gio"> 4. Ăn uống điều độ và đúng giờ</h2><p> Việc ăn uống đúng bữa giúp cơ thể hấp thu chất dinh dưỡng tốt hơn. Bạn nên chia nhỏ bữa ăn trong ngày, tránh bỏ bữa sáng, và hạn chế ăn khuya.</p><h2 id="ket-hop-voi-loi-song-lanh-manh"> 5. Kết hợp với lối sống lành mạnh</h2><p> Ngoài chế độ ăn uống, việc <strong>ngủ đủ giấc</strong>, <strong>tập thể dục đều đặn</strong> và <strong>giữ tinh thần thoải mái</strong> cũng là những yếu tố giúp tăng cường sức đề kháng tự nhiên của cơ thể.</p><p><em>Một cơ thể khỏe mạnh bắt đầu từ những thói quen nhỏ — hãy bắt đầu chăm sóc bản thân từ hôm nay!</em></p>', 'Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng', 'bai-viet-ve-than-kinh-7', 'https://benhvientinh.caobang.gov.vn/uploads/news/2022_02/che-do-dinh-duong-covid19.jpg', NULL, 103, '2025-10-01 12:00:00', '2025-11-24 08:10:14.728', '2025-10-01 12:00:00', '3f3ab543-09d5-475b-8e57-366330d4f400', '2abfa60b-520e-432d-9cc3-b106f977911f', 'published', false, '{}', '[{"id": "che-do-an-uong-lanh-manh-giup-tang-cuong-suc-de-khang", "label": "Chế độ ăn uống lành mạnh giúp tăng cường sức đề kháng", "level": 1}, {"id": "bo-sung-day-du-vitamin-va-khoang-chat", "label": "1. Bổ sung đầy đủ vitamin và khoáng chất", "level": 2}, {"id": "uong-du-nuoc-moi-ngay", "label": "2. Uống đủ nước mỗi ngày", "level": 2}, {"id": "han-che-thuc-pham-che-bien-san", "label": "3. Hạn chế thực phẩm chế biến sẵn", "level": 2}, {"id": "an-uong-dieu-do-va-dung-gio", "label": "4. Ăn uống điều độ và đúng giờ", "level": 2}, {"id": "ket-hop-voi-loi-song-lanh-manh", "label": "5. Kết hợp với lối sống lành mạnh", "level": 2}]', NULL, NULL);


--
-- TOC entry 5436 (class 0 OID 23095)
-- Dependencies: 240
-- Data for Name: health_informations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.health_informations VALUES ('98b7bf0b-33ec-4afd-9bda-1335d319fa38', '4de0fd7f-1696-4945-9549-22ae13666300', 60, 170, 'A+', false, false, false, false, '2025-10-23 16:18:28.594', '2025-10-23 16:18:28.594');
INSERT INTO public.health_informations VALUES ('214497a3-141c-4862-80a3-971f3e2ce8b0', 'e29c3065-9964-4767-9d25-dc0173fe8978', 90, 150, 'A+', true, true, true, false, '2025-10-23 16:18:28.581', '2025-11-07 19:15:22.35');


--
-- TOC entry 5429 (class 0 OID 23017)
-- Dependencies: 233
-- Data for Name: health_insurances; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.health_insurances VALUES ('8b1aef68-3f4e-43b1-8b97-3eee5e63e483', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'NL', 'DN4010123456789', '2023-01-01 00:00:00', '2024-12-31 23:59:59.999', '2025-11-04 13:27:09.464', '2025-11-04 13:27:09.464', '001', 'Bệnh viện Bạch Mai', 5, '01');
INSERT INTO public.health_insurances VALUES ('e29c3065-9964-4767-9d25-dc0173fe8978', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'SV', '0003500099', '2025-01-01 00:00:00', '2025-12-31 23:59:59.999', '2025-01-01 00:00:00', '2025-11-04 13:14:50.883', '404', 'Bệnh viện Tuệ Tĩnh', 4, '27');


--
-- TOC entry 5432 (class 0 OID 23061)
-- Dependencies: 236
-- Data for Name: hospitals; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.hospitals VALUES ('6557b68c-49fe-4345-9170-a76c22065e6a', 'Bệnh viện ABC', '77a78b7d-b674-4ef1-8d1f-37974eba72f6', '02438231111', '2025-10-23 15:28:07.488', '2025-10-23 15:28:07.488');


--
-- TOC entry 5456 (class 0 OID 36747)
-- Dependencies: 260
-- Data for Name: invoice_items; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.invoice_items VALUES ('efa3b6ba-254b-4bf5-a29f-939ebc677c44', '3ee3642b-8364-4a82-9a7d-79bfb7ba40b2', 'medicine', 'df19c448-dd7b-4cff-9158-d741d95d45c1', 'Prescription #DF19C448', 1, 0, 'Medicines for prescription #DF19C448', '2026-01-09 04:30:47.657', '2026-01-09 04:30:47.657');
INSERT INTO public.invoice_items VALUES ('05a0ba30-7080-4e70-bdc3-f355a4c38164', '3ee3642b-8364-4a82-9a7d-79bfb7ba40b2', 'medicine', 'ffd387a3-68d1-4aac-8043-419be3304b2b', 'Prescription #FFD387A3', 1, 0, 'Medicines for prescription #FFD387A3', '2026-01-09 04:30:47.657', '2026-01-09 04:30:47.657');
INSERT INTO public.invoice_items VALUES ('c8d2fe48-fabc-4bfb-9701-93e043d7ba7a', '3ee3642b-8364-4a82-9a7d-79bfb7ba40b2', 'medicine', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed35', 'Prescription #E3EDD5F3', 1, 13000, 'Medicines for prescription #E3EDD5F3', '2026-01-09 04:30:47.657', '2026-01-09 04:30:47.657');
INSERT INTO public.invoice_items VALUES ('82002224-4f20-4b7d-b605-7710df77f9d8', '3ee3642b-8364-4a82-9a7d-79bfb7ba40b2', 'service', '5c2cc3f5-d0b2-478e-a91f-55dd109fe3bb', 'Kiểm tra tổng quát về mắt', 1, 200000, 'Kiểm tra thị lực và các bệnh lý liên quan đến mắt.', '2026-01-09 04:30:47.657', '2026-01-09 04:30:47.657');
INSERT INTO public.invoice_items VALUES ('85e9b2f4-b142-4826-a682-28e0f3754cef', '3ee3642b-8364-4a82-9a7d-79bfb7ba40b2', 'service', '72592fe8-c055-4afc-85d9-f83f2bb0433c', 'Chụp X-quang', 1, 500000, 'Chụp X-quang để chẩn đoán các bệnh lý xương và mô mềm.', '2026-01-09 04:30:47.657', '2026-01-09 04:30:47.657');
INSERT INTO public.invoice_items VALUES ('3a5df33d-dd84-4849-b987-03993297a042', '3ee3642b-8364-4a82-9a7d-79bfb7ba40b2', 'service', '2ce3a07d-84c2-4f28-8f53-5246b73655ca', 'Khám thai', 1, 250000, 'Khám định kỳ cho phụ nữ mang thai.', '2026-01-09 04:30:47.657', '2026-01-09 04:30:47.657');
INSERT INTO public.invoice_items VALUES ('ef5ea412-1ff0-4c72-8ff5-3325aa85a879', '3ee3642b-8364-4a82-9a7d-79bfb7ba40b2', 'service', '5998673e-2785-418b-8816-5fa4ed556d43', 'Lấy cao răng', 1, 150000, 'Loại bỏ cao răng và làm sạch răng miệng.', '2026-01-09 04:30:47.657', '2026-01-09 04:30:47.657');
INSERT INTO public.invoice_items VALUES ('65386f6c-0817-41aa-a1b9-4f2f72ef1e19', '3ee3642b-8364-4a82-9a7d-79bfb7ba40b2', 'service', 'd2f57f80-2dfd-4342-8fdd-1e7b792a17a9', 'Chụp X-quang', 1, 500000, 'Chụp X-quang để chẩn đoán các bệnh lý xương và mô mềm.', '2026-01-09 04:30:47.657', '2026-01-09 04:30:47.657');
INSERT INTO public.invoice_items VALUES ('7653afbf-d79b-4638-a652-cf9897f90715', '3ee3642b-8364-4a82-9a7d-79bfb7ba40b2', 'service', 'd9a1c064-f0ce-4e08-b86e-b61908997f6b', 'Lấy cao răng', 1, 150000, 'Loại bỏ cao răng và làm sạch răng miệng.', '2026-01-09 04:30:47.657', '2026-01-09 04:30:47.657');
INSERT INTO public.invoice_items VALUES ('b8f5cca3-8b3c-4ffd-83e5-22e8b3f6820a', '3ee3642b-8364-4a82-9a7d-79bfb7ba40b2', 'service', 'f5508a82-e197-4230-81bd-d50eae0b694d', 'Khám cao huyết áp', 1, 200000, 'Đo huyết áp và tư vấn điều trị tăng huyết áp.', '2026-01-09 04:30:47.657', '2026-01-09 04:30:47.657');
INSERT INTO public.invoice_items VALUES ('171df1f4-c7b4-47fc-b562-4c67db9b43de', 'f3ec5081-89b9-42b8-a459-5522332bbc13', 'medicine', '4b3c7e52-a3f7-4bea-952f-ec8c34589c58', 'Prescription #4B3C7E52', 1, 0, 'Medicines for prescription #4B3C7E52', '2026-01-09 05:38:44.009', '2026-01-09 05:38:44.009');
INSERT INTO public.invoice_items VALUES ('abedbacc-cf54-4c2c-91cb-75655fa68c70', 'f3ec5081-89b9-42b8-a459-5522332bbc13', 'service', 'a36bce6f-0176-4747-b17d-ef409ac89471', 'Kiểm tra tổng quát về mắt', 1, 200000, 'Kiểm tra thị lực và các bệnh lý liên quan đến mắt.', '2026-01-09 05:38:44.009', '2026-01-09 05:38:44.009');


--
-- TOC entry 5439 (class 0 OID 23135)
-- Dependencies: 243
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.invoices VALUES ('3ee3642b-8364-4a82-9a7d-79bfb7ba40b2', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'paid', '2026-01-09 04:30:47.612', '2026-01-09 04:37:01.893', 0, NULL, 'e29c3065-9964-4767-9d25-dc0173fe8978', NULL, '3f3ab543-09d5-475b-8e57-366330d4f400', 0, 1137600);
INSERT INTO public.invoices VALUES ('f3ec5081-89b9-42b8-a459-5522332bbc13', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'paid', '2026-01-09 05:38:43.999', '2026-01-09 05:38:51.7', 0, NULL, 'e29c3065-9964-4767-9d25-dc0173fe8978', NULL, '3f3ab543-09d5-475b-8e57-366330d4f400', 0, 100000);


--
-- TOC entry 5422 (class 0 OID 22974)
-- Dependencies: 226
-- Data for Name: managers; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.managers VALUES ('3f3ab543-09d5-475b-8e57-366330d4f400');


--
-- TOC entry 5454 (class 0 OID 36730)
-- Dependencies: 258
-- Data for Name: medical_records; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.medical_records VALUES ('e29c3065-9964-4767-9d25-dc0173fe8978', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Khám mắt', 'Mắt đo, bị sưng to', 'Bệnh đau mắt đo', 'Vệ sinh mắt hàng ngày bằng khăn sạch và nước ấm. Đeo kính râm, hạn chế sử dụng điện thoại, máy tính.', 'Cẩn trọng', '2025-12-30 13:21:09.125', '2025-12-30 13:20:52.643', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed35', true);
INSERT INTO public.medical_records VALUES ('b6c6670c-b18f-4142-a8b8-cbd2390b2573', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Khám mắt', 'Bệnh mu', 'Bệnh mắt', 'Uống thuốc dầu cá hàng ngày.', 'Tái khám sau 1 tuần.', '2026-01-03 10:33:38.519', '2026-01-06 21:16:04.893', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed37', false);
INSERT INTO public.medical_records VALUES ('96bb1d5c-314d-42b1-b406-96a08ad5b87f', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Khám mắt', 'Mắt đỏ', 'Đau mắt', 'Chuyển viện, lên bệnh viện Trung ương', 'Gấp', '2026-01-08 05:20:45.126', '2026-01-08 05:20:45.126', '17bb807b-f333-4d0c-b827-3e0a399746c4', false);
INSERT INTO public.medical_records VALUES ('b8f6ae72-9245-4e58-997c-0276f7ead943', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Khám mắt', 'Đau mắt', 'Đau mắt đỏ', 'Uống thuốc', NULL, '2026-01-08 06:35:01.761', '2026-01-08 06:35:01.761', '75f7dc79-1d17-4b9f-8d3f-41ff03fa82fc', false);
INSERT INTO public.medical_records VALUES ('53a94ca0-72cd-4b7b-8516-50c2e213d211', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Khám mắt', 'Mắt đau, màu đỏ', 'Đau mắt đỏ cấp 1', 'Tra thuốc đau mắt thường xuyên', '1', '2026-01-09 05:29:40.492', '2026-01-09 05:29:40.492', '40e91844-2ff7-4c02-8109-d3ec05992de0', false);
INSERT INTO public.medical_records VALUES ('cc8764f6-f19d-4715-9ad7-ecff3f419e89', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Đo mắt', 'Mắt nhìn kém', 'Cận thị', 'Hạn chế xem điện thoại. Bổ sung vitamin A trong bữa ăn', 'Hạn chế xem điện thoại', '2026-01-06 21:58:36.263', '2026-01-06 21:58:36.263', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed37', false);


--
-- TOC entry 5437 (class 0 OID 23107)
-- Dependencies: 241
-- Data for Name: medical_services; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.medical_services VALUES ('550e8400-e29b-41d4-a716-446655440002', '{https://media.vov.vn/sites/default/files/styles/large_watermark/public/2023-03/chuan_bi_xa_tri_cho_bn_tai_trung_tam_ung_buou_benh_vien_cho_ray.jpg,https://speedmaint.com/wp-content/uploads/2021/04/Thi%E1%BA%BFt-k%E1%BA%BF-ch%C6%B0a-c%C3%B3-t%C3%AAn-2023-04-18T104303.739-min-768x436.png}', 'c5045d11-2ecf-4a76-abda-15fda13e7e9c', 'Mổ cận thị', 'Phẫu thuật điều chỉnh thị lực bằng công nghệ LASIK.', 15000000, 'lần', 60, '2025-10-24 04:40:00', '2026-01-08 15:45:51.669', true, 20, 1);
INSERT INTO public.medical_services VALUES ('550e8400-e29b-41d4-a716-446655440003', '{https://www.lugiamedical.com/uploads/source/tin-tu-c/6.jpg,https://img.cand.com.vn/resize/800x800/NewFiles/Images/2023/07/06/1_6-1688601894282.jpg}', '22eacd01-1bb8-4827-a29b-0569e28a9619', 'Lấy cao răng', 'Loại bỏ cao răng và làm sạch răng miệng.', 150000, 'lần', 20, '2025-10-24 04:40:00', '2026-01-08 15:45:51.671', true, 30, 2);
INSERT INTO public.medical_services VALUES ('550e8400-e29b-41d4-a716-446655440004', '{https://xdcs.cdnchinhphu.vn/zoom/600_315/446259493575335936/2023/11/21/dv-17005365963261348697541-63-0-1001-1500-crop-17005366017301056073644.jpg}', '22eacd01-1bb8-4827-a29b-0569e28a9619', 'Tẩy trắng răng', 'Dịch vụ làm trắng răng bằng công nghệ hiện đại.', 2000000, 'lần', 45, '2025-10-24 04:40:00', '2026-01-08 15:45:51.672', true, 0, 2);
INSERT INTO public.medical_services VALUES ('550e8400-e29b-41d4-a716-446655440005', '{https://mic.mediacdn.vn/639352410187198464/2024/12/24/photo-1735029190521-17350291907701442768340.jpeg}', '3c034557-0af9-4ef8-849e-8f2139df2183', 'Niềng răng', 'Chỉnh nha để điều chỉnh cấu trúc răng.', 30000000, 'gói', 120, '2025-10-24 04:40:00', '2026-01-08 15:45:51.674', true, 10, 2);
INSERT INTO public.medical_services VALUES ('550e8400-e29b-41d4-a716-446655440006', '{https://itacenter.vn/wp-content/uploads/2022/04/nhung-bat-cap-khi-ung-dung-cong-nghe-thong-tin-trong-y-te.jpg,https://duhung.vn/wp-content/uploads/2025/06/Giai-phap-kham-chua-benh-hoi-chuan-tu-xa-cho-nganh-Y-te-768x1024.jpg}', '32c48b93-0a02-45c6-b528-2a2c4da98649', 'Siêu âm thai nhi', 'Kiểm tra sự phát triển của thai nhi bằng siêu âm.', 300000, 'lần', 20, '2025-10-24 04:40:00', '2026-01-08 15:45:51.678', true, 60, 3);
INSERT INTO public.medical_services VALUES ('550e8400-e29b-41d4-a716-446655440007', '{https://media-cdn-v2.laodong.vn/storage/newsportal/2025/3/13/1476275/Bac-Si-Bach-Mai.jpeg?w=526&h=314&crop=auto&scale=both,https://static-images.vnncdn.net/vps_images_publish/000001/000003/2025/7/3/cac-benh-vien-lon-o-tphcm-se-ho-tro-chuyen-mon-cho-trung-tam-y-te-tai-con-dao-102883.jpg?width=0&s=Jp9yF_SBJVyrCsAt7jXMAA}', '32c48b93-0a02-45c6-b528-2a2c4da98649', 'Khám thai', 'Khám định kỳ cho phụ nữ mang thai.', 250000, 'lần', 30, '2025-10-24 04:40:00', '2026-01-08 15:45:51.68', true, 50, 3);
INSERT INTO public.medical_services VALUES ('550e8400-e29b-41d4-a716-446655440008', '{https://speedmaint.com/wp-content/uploads/2021/04/equiped-medical-cabinet.jpg,https://speedmaint.com/wp-content/uploads/2021/01/speedmaint-quy-trinh-quan-ly-trang-thiet-bi-2.jpg}', '53c7f03e-8283-4bbd-b610-b278fbde9d58', 'Khám cao huyết áp', 'Đo huyết áp và tư vấn điều trị tăng huyết áp.', 200000, 'lần', 25, '2025-10-24 04:40:00', '2026-01-08 15:45:51.682', true, 50, 4);
INSERT INTO public.medical_services VALUES ('550e8400-e29b-41d4-a716-446655440009', '{https://media.thuonghieucongluan.vn/resize_640x360/uploads/2024/09/04/thiet-bi-y-te-1-1725408375.jpg}', 'c0c4264a-9b04-4fe0-8713-5523877ecdf2', 'Điều trị viêm xoang', 'Điều trị các bệnh lý viêm xoang mũi.', 500000, 'lần', 40, '2025-10-24 04:40:00', '2026-01-08 15:45:51.683', true, 40, 5);
INSERT INTO public.medical_services VALUES ('550e8400-e29b-41d4-a716-446655440010', '{https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdi3rn_KNAlqMm4OWDCxRqMpf-E729wAKgjQ&s,https://media.vov.vn/sites/default/files/styles/large_watermark/public/2023-03/chuan_bi_xa_tri_cho_bn_tai_trung_tam_ung_buou_benh_vien_cho_ray.jpg}', 'c2acfc24-536f-4838-bd26-99fbd467b4cc', 'Xét nghiệm máu', 'Phân tích máu để kiểm tra các chỉ số sức khỏe.', 300000, 'lần', 15, '2025-10-24 04:40:00', '2026-01-08 15:45:51.684', true, 60, 6);
INSERT INTO public.medical_services VALUES ('550e8400-e29b-41d4-a716-446655440011', '{https://speedmaint.com/wp-content/uploads/2021/04/Thi%E1%BA%BFt-k%E1%BA%BF-ch%C6%B0a-c%C3%B3-t%C3%AAn-2023-04-18T104303.739-min-768x436.png,https://www.lugiamedical.com/uploads/source/tin-tu-c/6.jpg}', '409ecea3-6201-4b4a-8796-797c90b6846f', 'Xét nghiệm ung thư vú', 'Kiểm tra các dấu hiệu ung thư vú qua xét nghiệm chuyên sâu.', 1000000, 'lần', 30, '2025-10-24 04:40:00', '2026-01-08 15:45:51.686', true, 30, 6);
INSERT INTO public.medical_services VALUES ('550e8400-e29b-41d4-a716-446655440012', '{https://img.cand.com.vn/resize/800x800/NewFiles/Images/2023/07/06/1_6-1688601894282.jpg}', 'b36334f6-4c2f-4a0c-9dc9-436830047fae', 'Chụp MRI', 'Chụp cộng hưởng từ để chẩn đoán hình ảnh.', 3000000, 'lần', 60, '2025-10-24 04:40:00', '2026-01-08 15:45:51.688', true, 20, 7);
INSERT INTO public.medical_services VALUES ('550e8400-e29b-41d4-a716-446655440013', '{https://www.fvhospital.com/wp-content/uploads/2018/09/PI20.jpg}', '2d4d23d8-278f-4602-9a31-562fdcc71b50', 'Chụp X-quang', 'Chụp X-quang để chẩn đoán các bệnh lý xương và mô mềm.', 500000, 'lần', 15, '2025-10-24 04:40:00', '2026-01-08 15:45:51.689', true, 40, 7);
INSERT INTO public.medical_services VALUES ('550e8400-e29b-41d4-a716-446655440001', '{https://benhvienthucuc.vn/wp-content/uploads/2021/01/IMG_0651.jpg,https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdi3rn_KNAlqMm4OWDCxRqMpf-E729wAKgjQ&s}', '4be581fd-1616-4f54-b817-444b5c6bc3ae', 'Kiểm tra tổng quát về mắt', 'Kiểm tra thị lực và các bệnh lý liên quan đến mắt.', 200000, 'lần', 30, '2025-10-24 04:40:00', '2026-01-08 15:45:51.664', true, 50, 1);


--
-- TOC entry 5443 (class 0 OID 23174)
-- Dependencies: 247
-- Data for Name: medicine_usages; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.medicine_usages VALUES ('c47dbbab-b994-4eec-9b60-b89f89058a16', 'df19c448-dd7b-4cff-9158-d741d95d45c1', '0d37d96f-22af-4ac4-bc49-6436b823e397', 1, 0, 'Uống 3 ngày 1 lần', '2026-01-06 20:17:25.439', '2026-01-06 20:17:25.439', false, 'Omeprazole 20mg');
INSERT INTO public.medicine_usages VALUES ('7cad8d67-2224-4142-902f-5be1d7bce40c', 'df19c448-dd7b-4cff-9158-d741d95d45c1', '35728b3d-7ea8-4593-b188-5a6d196daf7b', 1, 0, 'Uống ngày 2 viên vào buồi sáng', '2026-01-06 20:17:25.439', '2026-01-06 20:17:25.439', false, 'Azithromycin 250mg');
INSERT INTO public.medicine_usages VALUES ('8e372c27-c087-4cf3-bc85-f915061195b9', 'df19c448-dd7b-4cff-9158-d741d95d45c1', '0d37d96f-22af-4ac4-bc49-6436b823e397', 1, 0, 'Uống 3 ngày 1 lần', '2026-01-06 20:18:28.084', '2026-01-06 20:18:28.084', false, 'Omeprazole 20mg');
INSERT INTO public.medicine_usages VALUES ('0bd3206b-9948-4ada-acc9-3f0f59c867eb', 'df19c448-dd7b-4cff-9158-d741d95d45c1', '35728b3d-7ea8-4593-b188-5a6d196daf7b', 1, 0, 'Uống ngày 2 viên vào buồi sáng', '2026-01-06 20:18:28.084', '2026-01-06 20:18:28.084', false, 'Azithromycin 250mg');
INSERT INTO public.medicine_usages VALUES ('c3d7c151-53cb-4665-ac56-7cdb3450f4f3', 'ffd387a3-68d1-4aac-8043-419be3304b2b', 'c12f1b3a-46ba-40aa-ab72-1389a237e558', 1, 0, 'Ngày 10 viên', '2026-01-06 22:00:03.663', '2026-01-06 22:00:03.663', false, 'Ibuprofen 400mg');
INSERT INTO public.medicine_usages VALUES ('e3edd5f3-7c7b-4abe-92ca-c5d77539ed35', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed35', 'ea471c92-8520-4811-921f-dc1e3a1745e3', 1, 5000, 'Ngày uống 1 lần vào buổi sáng', '2025-12-30 13:23:25.588', '2026-01-09 04:02:10.799', true, 'Paracetamol 500mg');
INSERT INTO public.medicine_usages VALUES ('e3edd5f3-7c7b-4abe-92ca-c5d77539ed36', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed35', '5c2cc3f5-d0b2-478e-a91f-55dd109fe3bb', 1, 8000, 'Uống buổi tối', '2025-12-30 13:24:32.173', '2026-01-09 04:02:10.799', true, 'Amoxicillin 500mg');
INSERT INTO public.medicine_usages VALUES ('6ded51de-3bb0-4d90-a795-87b59130d040', '4b3c7e52-a3f7-4bea-952f-ec8c34589c58', '0d37d96f-22af-4ac4-bc49-6436b823e397', 1, 0, 'Ngày 10 viên', '2026-01-09 05:36:29.896', '2026-01-09 05:36:29.896', false, 'Omeprazole 20mg');


--
-- TOC entry 5441 (class 0 OID 23156)
-- Dependencies: 245
-- Data for Name: medicines; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.medicines VALUES ('ea471c92-8520-4811-921f-dc1e3a1745e3', 'Paracetamol 500mg', 'Paracetamol', 'Panadol', 'Thuốc giảm đau, hạ sốt cho người lớn và trẻ em trên 12 tuổi.', 'Giảm đau', 'Viên nén', '500mg', 'Viên', 5000, 'GlaxoSmithKline', 'Anh', '{"Buồn nôn","Phát ban"}', '{Rượu,"Thuốc chống đông máu"}', '{"Đau đầu",Sốt,"Đau cơ"}', '{"Dị ứng paracetamol","Suy gan nặng"}', 'Bảo quản nơi khô ráo, dưới 25°C', 1000, 'available', '2025-10-24 09:08:50.802', '2025-10-24 09:08:50.802');
INSERT INTO public.medicines VALUES ('c12f1b3a-46ba-40aa-ab72-1389a237e558', 'Ibuprofen 400mg', 'Ibuprofen', 'Advil', 'Thuốc chống viêm không steroid, giảm đau và hạ sốt.', 'Giảm đau', 'Viên nén', '400mg', 'Viên', 6000, 'Pfizer', 'Mỹ', '{"Đau dạ dày","Buồn nôn"}', '{Aspirin,"Thuốc lợi tiểu"}', '{"Đau khớp","Đau lưng",Sốt}', '{"Loét dạ dày","Hen suyễn"}', 'Bảo quản nơi khô ráo, tránh ánh nắng', 800, 'available', '2025-10-24 09:08:50.802', '2025-10-24 09:08:50.802');
INSERT INTO public.medicines VALUES ('58777d5e-c711-4421-9e78-1caf0f7e2c56', 'Cefalexin 250mg', 'Cefalexin', 'Keflex', 'Kháng sinh cephalosporin điều trị nhiễm khuẩn.', 'Kháng sinh', 'Viên nang', '250mg', 'Viên', 7000, 'Eli Lilly', 'Mỹ', '{"Tiêu chảy","Dị ứng da"}', '{Metformin,Probenecid}', '{"Nhiễm khuẩn đường tiết niệu","Viêm da"}', '{"Dị ứng cephalosporin"}', 'Bảo quản ở nhiệt độ phòng', 300, 'available', '2025-10-24 09:08:50.802', '2025-10-24 09:08:50.802');
INSERT INTO public.medicines VALUES ('0d37d96f-22af-4ac4-bc49-6436b823e397', 'Omeprazole 20mg', 'Omeprazole', 'Losec', 'Thuốc ức chế bơm proton điều trị trào ngược dạ dày.', 'Tiêu hóa', 'Viên nang', '20mg', 'Viên', 12000, 'AstraZeneca', 'Thụy Điển', '{"Đau đầu","Tiêu chảy"}', '{Clopidogrel,Diazepam}', '{"Trào ngược dạ dày","Loét dạ dày"}', '{"Dị ứng omeprazole"}', 'Bảo quản nơi khô ráo, dưới 30°C', 600, 'available', '2025-10-24 09:08:50.802', '2025-10-24 09:08:50.802');
INSERT INTO public.medicines VALUES ('2b1a1310-0a12-47df-b38f-bf51cbd2367d', 'Metformin 500mg', 'Metformin', 'Glucophage', 'Thuốc điều trị tiểu đường type 2.', 'Tiểu đường', 'Viên nén', '500mg', 'Viên', 9000, 'Merck', 'Đức', '{"Buồn nôn","Đau bụng"}', '{"Thuốc lợi tiểu",Cimetidine}', '{"Tiểu đường type 2"}', '{"Suy thận","Nhiễm toan ceton"}', 'Bảo quản ở nhiệt độ phòng', 400, 'available', '2025-10-24 09:08:50.802', '2025-10-24 09:08:50.802');
INSERT INTO public.medicines VALUES ('c64c7b46-3627-4835-b509-a4fc80d2696e', 'Amlodipine 5mg', 'Amlodipine', 'Norvasc', 'Thuốc điều trị cao huyết áp và đau thắt ngực.', 'Tim mạch', 'Viên nén', '5mg', 'Viên', 10000, 'Pfizer', 'Mỹ', '{"Sưng chân","Đau đầu"}', '{Simvastatin,Diltiazem}', '{"Cao huyết áp","Đau thắt ngực"}', '{"Huyết áp thấp","Suy tim nặng"}', 'Bảo quản nơi khô ráo, tránh ánh sáng', 700, 'available', '2025-10-24 09:08:50.802', '2025-10-24 09:08:50.802');
INSERT INTO public.medicines VALUES ('d9b5f58b-3773-4af3-bfc9-fc62c000fdd2', 'Loratadine 10mg', 'Loratadine', 'Claritin', 'Thuốc kháng histamin điều trị dị ứng.', 'Dị ứng', 'Viên nén', '10mg', 'Viên', 6000, 'Bayer', 'Đức', '{"Buồn ngủ","Khô miệng"}', '{Erythromycin,Ketoconazole}', '{"Viêm mũi dị ứng","Mề đay"}', '{"Dị ứng loratadine"}', 'Bảo quản ở nhiệt độ phòng', 900, 'available', '2025-10-24 09:08:50.802', '2025-10-24 09:08:50.802');
INSERT INTO public.medicines VALUES ('9f927be1-559d-4150-8416-ab850d8c6125', 'Salbutamol 4mg', 'Salbutamol', 'Ventolin', 'Thuốc giãn phế quản điều trị hen suyễn.', 'Hô hấp', 'Viên nén', '4mg', 'Viên', 5000, 'GlaxoSmithKline', 'Anh', '{"Run tay","Hồi hộp"}', '{"Thuốc chẹn beta","Thuốc lợi tiểu"}', '{"Hen suyễn",COPD}', '{"Dị ứng salbutamol"}', 'Bảo quản nơi khô ráo, dưới 25°C', 200, 'available', '2025-10-24 09:08:50.802', '2025-10-24 09:08:50.802');
INSERT INTO public.medicines VALUES ('35728b3d-7ea8-4593-b188-5a6d196daf7b', 'Azithromycin 250mg', 'Azithromycin', 'Zithromax', 'Kháng sinh điều trị nhiễm khuẩn đường hô hấp và da.', 'Kháng sinh', 'Viên nang', '250mg', 'Viên', 15000, 'Pfizer', 'Mỹ', '{"Tiêu chảy","Buồn nôn"}', '{Warfarin,Digoxin}', '{"Viêm phổi","Viêm họng"}', '{"Dị ứng macrolide"}', 'Bảo quản ở nhiệt độ phòng', 300, 'available', '2025-10-24 09:08:50.802', '2025-10-24 09:08:50.802');
INSERT INTO public.medicines VALUES ('a28c22c7-9e4b-444b-924c-76861373cb1d', 'Aspirin 81mg', 'Acetylsalicylic Acid', 'Bayer Aspirin', 'Thuốc chống kết tập tiểu cầu và giảm đau nhẹ.', 'Tim mạch', 'Viên nén', '81mg', 'Viên', 3000, 'Bayer', 'Đức', '{"Đau dạ dày","Chảy máu"}', '{Ibuprofen,Warfarin}', '{"Phòng ngừa đột quỵ","Đau nhẹ"}', '{"Loét dạ dày","Rối loạn đông máu"}', 'Bảo quản nơi khô ráo, tránh ánh sáng', 1200, 'available', '2025-10-24 09:08:50.802', '2025-10-24 09:08:50.802');
INSERT INTO public.medicines VALUES ('b62f5429-9104-4c20-a684-8dee8097a84e', 'Ciprofloxacin 500mg', 'Ciprofloxacin', 'Cipro', 'Kháng sinh fluoroquinolone điều trị nhiễm khuẩn.', 'Kháng sinh', 'Viên nén', '500mg', 'Viên', 12000, 'Bayer', 'Đức', '{"Buồn nôn","Đau khớp"}', '{Theophylline,"Thuốc chống đông"}', '{"Nhiễm khuẩn tiết niệu","Viêm phổi"}', '{"Dị ứng fluoroquinolone","Trẻ em dưới 18 tuổi"}', 'Bảo quản ở nhiệt độ phòng', 400, 'available', '2025-10-24 09:08:50.802', '2025-10-24 09:08:50.802');
INSERT INTO public.medicines VALUES ('bed67297-9a2b-4186-ab91-af0b4df4ffc1', 'Losartan 50mg', 'Losartan', 'Cozaar', 'Thuốc điều trị cao huyết áp và suy tim.', 'Tim mạch', 'Viên nén', '50mg', 'Viên', 11000, 'Merck', 'Mỹ', '{"Chóng mặt","Mệt mỏi"}', '{"Thuốc lợi tiểu",Lithium}', '{"Cao huyết áp","Suy tim"}', '{"Thai kỳ","Suy thận nặng"}', 'Bảo quản nơi khô ráo, dưới 30°C', 600, 'available', '2025-10-24 09:08:50.802', '2025-10-24 09:08:50.802');
INSERT INTO public.medicines VALUES ('811209e3-b157-4225-8ffd-e84111d68880', 'Prednisolone 5mg', 'Prednisolone', 'Orapred', 'Corticosteroid điều trị viêm và dị ứng.', 'Chống viêm', 'Viên nén', '5mg', 'Viên', 4000, 'Pfizer', 'Mỹ', '{"Tăng cân","Mất ngủ"}', '{NSAIDs,"Thuốc tiểu đường"}', '{"Viêm khớp","Dị ứng nặng"}', '{"Nhiễm nấm toàn thân","Dị ứng corticosteroid"}', 'Bảo quản ở nhiệt độ phòng', 500, 'available', '2025-10-24 09:08:50.802', '2025-10-24 09:08:50.802');
INSERT INTO public.medicines VALUES ('d809f983-be55-4246-9061-dfc77d79d228', 'Atorvastatin 20mg', 'Atorvastatin', 'Lipitor', 'Thuốc giảm cholesterol và phòng ngừa bệnh tim mạch.', 'Tim mạch', 'Viên nén', '20mg', 'Viên', 15000, 'Pfizer', 'Mỹ', '{"Đau cơ","Tăng men gan"}', '{Grapefruit,Erythromycin}', '{"Cholesterol cao","Phòng ngừa đột quỵ"}', '{"Suy gan","Thai kỳ"}', 'Bảo quản nơi khô ráo, dưới 25°C', 300, 'available', '2025-10-24 09:08:50.802', '2025-10-24 09:08:50.802');
INSERT INTO public.medicines VALUES ('a4486a3d-b194-4b14-a8ae-a6f30202e277', 'Montelukast 10mg', 'Montelukast', 'Singulair', 'Thuốc điều trị hen suyễn và dị ứng mũi.', 'Hô hấp', 'Viên nén', '10mg', 'Viên', 12000, 'Merck', 'Mỹ', '{"Đau đầu","Buồn nôn"}', '{Phenobarbital,Rifampin}', '{"Hen suyễn","Viêm mũi dị ứng"}', '{"Dị ứng montelukast"}', 'Bảo quản nơi khô ráo, tránh ánh sáng', 400, 'available', '2025-10-24 09:08:50.802', '2025-10-24 09:08:50.802');
INSERT INTO public.medicines VALUES ('3f05411d-4c41-4ca9-97ab-47475b3622f1', 'Domperidone 10mg', 'Domperidone', 'Motilium', 'Thuốc điều trị buồn nôn và nôn.', 'Tiêu hóa', 'Viên nén', '10mg', 'Viên', 7000, 'Janssen', 'Bỉ', '{"Khô miệng","Đau đầu"}', '{Ketoconazole,Erythromycin}', '{"Buồn nôn",Nôn}', '{"Xuất huyết tiêu hóa","Tắc ruột"}', 'Bảo quản nơi khô ráo, dưới 30°C', 600, 'available', '2025-10-24 09:08:50.802', '2025-10-24 09:08:50.802');
INSERT INTO public.medicines VALUES ('12260273-e329-4fc9-a86a-19b492ad9b59', 'Levothyroxine 100mcg', 'Levothyroxine', 'Synthroid', 'Thuốc điều trị suy giáp.', 'Nội tiết', 'Viên nén', '100mcg', 'Viên', 8000, 'AbbVie', 'Mỹ', '{"Hồi hộp","Mất ngủ"}', '{"Thuốc chống đông","Thuốc tiểu đường"}', '{"Suy giáp","Bướu giáp"}', '{"Cường giáp","Suy thượng thận"}', 'Bảo quản nơi khô ráo, tránh ánh sáng', 500, 'available', '2025-10-24 09:08:50.802', '2025-10-24 09:08:50.802');
INSERT INTO public.medicines VALUES ('4af0ff6e-f422-4a68-afa0-2d351a0c33d2', 'Dexamethasone 0.5mg', 'Dexamethasone', 'Decadron', 'Corticosteroid điều trị viêm và dị ứng nặng.', 'Chống viêm', 'Viên nén', '0.5mg', 'Viên', 3000, 'Merck', 'Mỹ', '{"Tăng cân","Loét dạ dày"}', '{NSAIDs,"Vaccine sống"}', '{"Viêm khớp","Dị ứng nặng"}', '{"Nhiễm nấm toàn thân"}', 'Bảo quản nơi khô ráo, dưới 25°C', 0, 'out_of_stock', '2025-10-24 09:08:50.802', '2025-10-24 09:08:50.802');
INSERT INTO public.medicines VALUES ('4af0ff6e-f422-4a68-afa0-2d351a0c33d3', 'Dexamethasone 0.5mg', 'Dexamethasone', 'Decadron', 'Dầu cá Omega 369', 'Mắt', 'Viên nén', '0.5mg', 'Viên', 3000, 'Merck', 'Mỹ', '{"Tăng cân","Loét dạ dày"}', '{NSAIDs,"Vaccine sống"}', '{"Viêm khớp","Dị ứng nặng"}', '{"Nhiễm nấm toàn thân"}', 'Bảo quản nơi khô ráo, dưới 25°C', 0, 'out_of_stock', '2025-10-24 09:08:50.802', '2025-10-24 09:08:50.802');
INSERT INTO public.medicines VALUES ('5c2cc3f5-d0b2-478e-a91f-55dd109fe3bb', 'Amoxicillin 500mg', 'Amoxicillin', 'Amoxil', 'Kháng sinh điều trị nhiễm khuẩn đường hô hấp, tiết niệu.', 'Kháng sinh', 'Viên nang', '500mg', 'Viên', 8000, 'Pfizer', 'Mỹ', '{"Tiêu chảy","Phát ban"}', '{Methotrexate,Warfarin}', '{"Viêm phổi","Viêm họng","Nhiễm khuẩn da"}', '{"Dị ứng penicillin","Suy thận nặng"}', 'Bảo quản ở nhiệt độ phòng, tránh ẩm', 500, 'available', '2025-10-24 09:08:50.802', '2025-10-24 09:08:50.802');
INSERT INTO public.medicines VALUES ('515c15d3-ad27-41f3-a6be-ce605c447ac5', 'Clarithromycin 500mg', 'Clarithromycin', 'Biaxin', 'Kháng sinh điều trị nhiễm khuẩn đường hô hấp.', 'Kháng sinh', 'Viên nén', '500mg', 'Hộp', 18000, 'Abbott', 'Mỹ', '{"Vị kim loại","Tiêu chảy"}', '{Statins,Warfarin}', '{"Viêm phổi","Viêm họng"}', '{"Dị ứng macrolide","Suy gan nặng"}', 'Bảo quản ở nhiệt độ phòng', 0, 'out_of_stock', '2025-10-24 09:08:50.802', '2025-10-24 09:08:50.802');


--
-- TOC entry 5448 (class 0 OID 23218)
-- Dependencies: 252
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.messages VALUES ('4f3bb373-4842-47a4-9d97-423cdaff125e', '10f51a6b-fe6a-4569-9fb3-5b70bad9eff2', 'Hello. Tôi là Tuấn, 22 tuổi. Tôi đang bị ho, đau họng, sổ mũi. Hiện tại trời đang trở lạnh. Bạn hãy tư vấn cho tôi', 'user', NULL, NULL, '2026-01-07 14:19:00.72', '2026-01-07 14:19:00.72');
INSERT INTO public.messages VALUES ('b8d00bae-7fc7-47c1-8f5d-d44cd0892ef1', '10f51a6b-fe6a-4569-9fb3-5b70bad9eff2', 'Chào bạn Tuấn,

Tôi không thể kê đơn thuốc hoặc đưa ra tên cụ thể của các loại thuốc mà bạn nên mua. Việc sử dụng thuốc cần được cân nhắc kỹ lưỡng dựa trên tình trạng sức khỏe cụ thể, tiền sử bệnh lý và các loại thuốc khác mà bạn có thể đang dùng.

Để đảm bảo an toàn và hiệu quả, bạn nên đến gặp bác sĩ hoặc dược sĩ để được tư vấn trực tiếp. Họ sẽ thăm khám, đánh giá tình trạng của bạn và đưa ra lời khuyên về loại thuốc phù hợp nhất (nếu cần) cũng như liều lượng và cách dùng đúng cách.

Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.', 'bot', NULL, NULL, '2026-01-07 14:20:14.23', '2026-01-07 14:20:14.23');
INSERT INTO public.messages VALUES ('3dcde129-0712-4955-a3ff-a19c0bcdd49b', 'ad966308-df5b-4961-b204-ddad5a901083', 'Chào bạn, tôi là Tuấn. Tôi đang bị trĩ. Hướng dẫn tôi', 'user', NULL, NULL, '2026-01-08 06:26:27.558', '2026-01-08 06:26:27.558');
INSERT INTO public.messages VALUES ('d70fdf80-1faf-4745-aafa-201c1bb44752', '0f5040b3-c160-4ffc-b1b5-2c364e0ed9ce', 'Chào bạn!

Tôi là chatbot chỉ trả lời các câu hỏi liên quan tới y tế, sức khỏe. Bạn hãy tập trung hỏi về y tế, sức khỏe nhé.

Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.', 'bot', NULL, NULL, '2026-01-08 06:27:13.422', '2026-01-08 06:27:13.422');
INSERT INTO public.messages VALUES ('1eaed399-d672-47ff-8e02-01b299dfddc0', '0f5040b3-c160-4ffc-b1b5-2c364e0ed9ce', 'Chào bạn,

Với các triệu chứng như đau bụng và đi ngoài nhiều lần, có thể có nhiều nguyên nhân khác nhau gây ra. Tôi không thể chẩn đoán bệnh cho bạn.

Tuy nhiên, dựa trên thông tin tham khảo, tình trạng đi ngoài nhiều lần có thể biểu hiện ở các mức độ khác nhau:
*   **Thể nhẹ:** Có thể đi tiêu phân nhầy máu vài lần mỗi ngày, kèm theo ít mệt mỏi.
*   **Thể trung bình:** Bệnh nhân có thể mệt nhiều, đi tiêu khoảng 5-15 lần mỗi ngày.
*   **Thể nặng:** Bệnh nhân có thể suy kiệt, mất nước, rối loạn chất điện giải, bụng chướng, cảm giác mót rặn và đau bụng nhiều, đi tiêu phân nhầy máu >15 lần/ngày.

Các triệu chứng này có thể là dấu hiệu của nhiều vấn đề tiêu hóa khác nhau như nhiễm trùng đường ruột, ngộ độc thực phẩm, viêm đại tràng, hoặc các tình trạng khác.

Để biết chính xác nguyên nhân và có hướng điều trị phù hợp, bạn nên đi khám bác sĩ càng sớm càng tốt, đặc biệt nếu bạn cảm thấy mệt mỏi nhiều, có sốt, phân có máu hoặc các triệu chứng trở nên nghiêm trọng hơn. Bác sĩ sẽ thăm khám, hỏi rõ hơn về các triệu chứng và có thể yêu cầu làm các xét nghiệm cần thiết để đưa ra chẩn đoán chính xác.

Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.', 'bot', NULL, NULL, '2026-01-08 06:27:53.974', '2026-01-08 06:27:53.974');
INSERT INTO public.messages VALUES ('68ad5095-5c86-48ac-9e8a-7ca373be9584', 'd6a1e0c0-db9b-4448-80bd-47f60a0dea78', 'Thời tiết hôm nay như thế nào tại Hà Nội', 'user', NULL, NULL, '2026-01-08 06:48:27.812', '2026-01-08 06:48:27.812');
INSERT INTO public.messages VALUES ('b97152fa-5907-44ab-bca3-cc1add2fe8b4', '234a1786-7f78-4b4a-88e6-7ed353e7b6d6', 'tôi bị sốt 39 độ. Tôi nên làm gì', 'user', NULL, NULL, '2026-01-09 08:46:56.612', '2026-01-09 08:46:56.612');
INSERT INTO public.messages VALUES ('d848672b-a1b6-4c2a-9379-9c69c9e6ac2d', 'b604fca5-e05e-40a3-8aab-55bacf663f7e', 'Chào bạn,

Là một chatbot y tế, tôi không thể kê đơn thuốc hay khuyên bạn nên mua những loại thuốc gì. Việc sử dụng thuốc cần dựa trên chẩn đoán chính xác của bác sĩ về tình trạng bệnh lý cụ thể của bạn, cũng như cân nhắc các yếu tố như tiền sử bệnh, các loại thuốc khác đang sử dụng, và tình trạng sức khỏe tổng thể.

Việc tự ý mua và sử dụng thuốc có thể không hiệu quả, gây ra tác dụng phụ không mong muốn hoặc làm trầm trọng thêm tình trạng bệnh.

Để đảm bảo an toàn và hiệu quả, bạn nên tham khảo ý kiến của bác sĩ hoặc dược sĩ để được tư vấn về loại thuốc phù hợp nhất với tình trạng sức khỏe của mình.

Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.

---
 **Nguồn tham khảo:** AI Medical Knowledge', 'bot', NULL, NULL, '2026-01-09 08:47:59.923', '2026-01-09 08:47:59.923');
INSERT INTO public.messages VALUES ('41d764c4-f4a9-4187-bb95-808911ad4124', 'f459d089-247c-4e81-b010-ab50e8e3bf14', 'Tôi hiểu lo lắng của bạn về triệu chứng này. Để được tư vấn y tế chính xác, vui lòng tham khảo ý kiến chuyên gia y tế có thể đánh giá đúng tình trạng của bạn. Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.', 'bot', NULL, NULL, '2025-12-06 13:47:46.818', '2025-12-06 13:47:46.818');
INSERT INTO public.messages VALUES ('8694ade0-2f8f-4949-85b6-bb76e1e5a052', 'f0100657-149e-4d6b-86a0-7cbbbd2c3543', 'Bệnh đại trang là gì', 'user', NULL, NULL, '2025-12-06 13:53:35.047', '2025-12-06 13:53:35.047');
INSERT INTO public.messages VALUES ('6d985310-c2aa-4c95-a326-8d14835e7cbd', 'f0100657-149e-4d6b-86a0-7cbbbd2c3543', 'Bệnh đại trang là gì', 'user', NULL, NULL, '2025-12-06 13:54:33.873', '2025-12-06 13:54:33.873');
INSERT INTO public.messages VALUES ('1d5e0373-5f8c-4c07-9cdd-5ae04052108a', 'd6ffa0ff-2326-4fad-8e0e-8b91b1149f70', 'Bệnh đau dạ dày là gì', 'user', NULL, NULL, '2025-12-10 13:06:50.724', '2025-12-10 13:06:50.724');
INSERT INTO public.messages VALUES ('d2084d4b-1c29-4d3b-863e-cf40b6046734', '10f51a6b-fe6a-4569-9fb3-5b70bad9eff2', 'Chào bạn Tuấn,

Với các triệu chứng ho, đau họng, sổ mũi khi trời đang trở lạnh, đây là những dấu hiệu khá phổ biến của các bệnh đường hô hấp trên như cảm lạnh thông thường, cúm hoặc viêm xoang cấp tính.

Để giúp bạn cảm thấy dễ chịu hơn, bạn có thể tham khảo một số biện pháp sau:

*   **Đối với sổ mũi:** Bạn nên nhỏ mũi và rửa mũi bằng nước muối sinh lý thường xuyên để làm sạch đường mũi và giảm nghẹt mũi.
*   **Đối với đau họng:** Súc miệng bằng nước muối sinh lý hoặc các dung dịch sát khuẩn phù hợp để làm dịu cổ họng và giảm viêm.
*   **Giảm ho và các triệu chứng khác:**
    *   Uống đủ nước ấm (như nước lọc, trà gừng, mật ong chanh ấm) để làm dịu cổ họng và làm loãng đờm.
    *   Nghỉ ngơi đầy đủ để cơ thể có thời gian phục hồi.
    *   Giữ ấm cơ thể, đặc biệt là vùng cổ và ngực khi thời tiết lạnh.
*   **Tăng cường sức đề kháng:**
    *   Ăn nhiều rau xanh và hoa quả, bổ sung vitamin C, A để tăng cường hệ miễn dịch của cơ thể.
    *   Duy trì lối sống lành mạnh và giữ gìn vệ sinh môi trường sống.
*   **Về thuốc:** Một số loại thuốc không kê đơn như thuốc giảm ho, thuốc làm lỏng chất tiết hoặc thuốc chống dị ứng có thể giúp giảm triệu chứng. Tuy nhiên, bạn nên tham khảo ý kiến của dược sĩ hoặc bác sĩ trước khi sử dụng bất kỳ loại thuốc nào.

Nếu các triệu chứng không thuyên giảm sau vài ngày, trở nên nặng hơn, hoặc xuất hiện các dấu hiệu như sốt cao kéo dài, khó thở, đau ngực, bạn nên đi khám bác sĩ để được chẩn đoán chính xác và có hướng điều trị phù hợp.

Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.', 'bot', NULL, NULL, '2026-01-07 14:19:16.913', '2026-01-07 14:19:16.913');
INSERT INTO public.messages VALUES ('987b4395-2a41-4963-90e1-ae5fb10729c7', '10f51a6b-fe6a-4569-9fb3-5b70bad9eff2', 'Tôi uống nước chanh, súc miệng bằng nước muối vào buổi sáng thì bệnh có đỡ không', 'user', NULL, NULL, '2026-01-07 14:21:05.08', '2026-01-07 14:21:05.08');
INSERT INTO public.messages VALUES ('98859486-b9fe-4f49-910c-d1130adedcce', 'ad966308-df5b-4961-b204-ddad5a901083', 'Chào bạn Tuấn,

Trĩ (hay còn gọi là bệnh lòi dom) là tình trạng các tĩnh mạch ở vùng hậu môn và trực tràng bị sưng và viêm. Bệnh có thể gây ra các triệu chứng khó chịu như đau, ngứa, chảy máu khi đi đại tiện, hoặc cảm giác có khối u ở hậu môn. Trĩ có thể là trĩ nội (bên trong trực tràng) hoặc trĩ ngoại (bên ngoài hậu môn).

Vì tôi không thể chẩn đoán hay kê đơn thuốc, tôi khuyên bạn nên đi khám bác sĩ chuyên khoa (ví dụ: bác sĩ tiêu hóa hoặc bác sĩ ngoại tổng quát) để được chẩn đoán chính xác tình trạng trĩ của bạn và có phác đồ điều trị phù hợp. Bác sĩ sẽ đánh giá mức độ nặng nhẹ của bệnh và đưa ra lời khuyên cụ thể, có thể bao gồm thay đổi lối sống, dùng thuốc hoặc can thiệp y tế nếu cần.

Trong thời gian chờ đợi đi khám, bạn có thể tham khảo một số biện pháp chung giúp giảm nhẹ triệu chứng và phòng ngừa trĩ trở nặng:

*   **Chế độ ăn uống:** Ăn nhiều thực phẩm giàu chất xơ như rau xanh, trái cây, ngũ cốc nguyên hạt để làm mềm phân và tránh táo bón.
*   **Uống đủ nước:** Uống đủ 2-2.5 lít nước mỗi ngày để hỗ trợ quá trình tiêu hóa và làm mềm phân.
*   **Tránh rặn khi đi đại tiện:** Không nên ngồi quá lâu trong nhà vệ sinh và tránh rặn mạnh khi đi đại tiện.
*   **Vệ sinh sạch sẽ:** Giữ vùng hậu môn sạch sẽ, có thể ngâm hậu môn trong nước ấm vài lần mỗi ngày để giảm đau và ngứa.
*   **Vận động thường xuyên:** Tập thể dục đều đặn giúp cải thiện lưu thông máu và chức năng ruột.

Hãy nhớ rằng đây chỉ là các biện pháp hỗ trợ, việc thăm khám bác sĩ là rất quan trọng để có hướng điều trị hiệu quả nhất cho tình trạng của bạn.

Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.', 'bot', NULL, NULL, '2026-01-08 06:26:33.341', '2026-01-08 06:26:33.341');
INSERT INTO public.messages VALUES ('f88007ce-6888-4202-81a2-5dd1adeb0621', '0f5040b3-c160-4ffc-b1b5-2c364e0ed9ce', 'Tôi đang bị đau bụng. Tôi đi ngoài nhiều lần. Bạn nghĩ tôi bị bệnh gì', 'user', NULL, NULL, '2026-01-08 06:27:42.218', '2026-01-08 06:27:42.218');
INSERT INTO public.messages VALUES ('6ad8b0b3-9987-4be1-9c9a-a69cac3e2278', 'd6a1e0c0-db9b-4448-80bd-47f60a0dea78', 'Thuốc Omeprazole 20mg dùng để chữa bệnh gì ?', 'user', NULL, NULL, '2026-01-08 06:47:09.69', '2026-01-08 06:47:09.69');
INSERT INTO public.messages VALUES ('3032feeb-3943-4831-9762-7f60bb73b594', 'd6a1e0c0-db9b-4448-80bd-47f60a0dea78', 'Tôi không thể cung cấp thông tin về thời tiết.

Tôi là chatbot chỉ trả lời các câu hỏi liên quan tới y tế, sức khỏe. Bạn hãy tập trung hỏi về y tế, sức khỏe nhé.

Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.', 'bot', NULL, NULL, '2026-01-08 06:48:30.845', '2026-01-08 06:48:30.845');
INSERT INTO public.messages VALUES ('a0c94f3e-596c-4445-a92b-e160bd74ddbb', 'b604fca5-e05e-40a3-8aab-55bacf663f7e', 'Tôi đang cảm thấy hồi hộp và chóng mặt. Bạn nghĩ tôi bị gì ?', 'user', NULL, NULL, '2026-01-09 08:46:12.776', '2026-01-09 08:46:12.776');
INSERT INTO public.messages VALUES ('f4afdd1a-6a90-4bbe-9604-f94281ddae82', '234a1786-7f78-4b4a-88e6-7ed353e7b6d6', 'Chào bạn, sốt 39 độ là một mức sốt khá cao. Bạn nên thực hiện các biện pháp sau để hạ sốt và theo dõi tình trạng sức khỏe của mình:

1.  **Hạ sốt vật lý:** Lau người bằng nước ấm (không dùng nước lạnh hoặc nước đá) ở các vùng như trán, nách, bẹn.
2.  **Uống đủ nước:** Uống nhiều nước lọc, nước oresol, nước trái cây để tránh mất nước do sốt.
3.  **Nghỉ ngơi:** Hạn chế vận động, nghỉ ngơi đầy đủ.
4.  **Mặc quần áo thoáng mát:** Mặc quần áo mỏng, rộng rãi để cơ thể dễ thoát nhiệt.
5.  **Sử dụng thuốc hạ sốt (nếu cần):** Bạn có thể cân nhắc dùng thuốc hạ sốt không kê đơn như Paracetamol hoặc Ibuprofen theo đúng liều lượng khuyến cáo trên bao bì hoặc theo chỉ dẫn của dược sĩ/bác sĩ.

**Quan trọng:** Nếu sốt không giảm sau khi áp dụng các biện pháp trên, hoặc nếu bạn có thêm các triệu chứng như đau đầu dữ dội, cứng cổ, phát ban, khó thở, lú lẫn, hoặc nếu bạn là người cao tuổi, trẻ nhỏ, hoặc có bệnh nền, bạn nên đi khám bác sĩ hoặc đến cơ sở y tế càng sớm càng tốt để được chẩn đoán nguyên nhân và điều trị phù hợp.

Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.

---
 **Nguồn tham khảo:** AI Medical Knowledge', 'bot', NULL, NULL, '2026-01-09 08:47:03.632', '2026-01-09 08:47:03.632');
INSERT INTO public.messages VALUES ('15478fb8-d1de-4e88-9ff7-c23a4c6b81d4', 'f0100657-149e-4d6b-86a0-7cbbbd2c3543', 'Tôi hiểu lo lắng của bạn về triệu chứng này. Để được tư vấn y tế chính xác, vui lòng tham khảo ý kiến chuyên gia y tế có thể đánh giá đúng tình trạng của bạn. Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.', 'bot', NULL, NULL, '2025-12-06 13:49:58.281', '2025-12-06 13:49:58.281');
INSERT INTO public.messages VALUES ('a7b873db-d3e9-412f-ab00-893084806d04', 'f0100657-149e-4d6b-86a0-7cbbbd2c3543', 'Tôi hiểu lo lắng của bạn về triệu chứng này. Để được tư vấn y tế chính xác, vui lòng tham khảo ý kiến chuyên gia y tế có thể đánh giá đúng tình trạng của bạn. Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.', 'bot', NULL, NULL, '2025-12-06 13:53:35.278', '2025-12-06 13:53:35.278');
INSERT INTO public.messages VALUES ('16756e8b-4043-4629-95e1-980bb7a19497', 'f0100657-149e-4d6b-86a0-7cbbbd2c3543', '"Bệnh đại tràng" là thuật ngữ chung chỉ các tình trạng bệnh lý ảnh hưởng đến đại tràng (ruột già). Các bệnh lý này có thể bao gồm viêm đại tràng (viêm niêm mạc đại tràng), hội chứng ruột kích thích (IBS), polyp đại tràng, hoặc ung thư đại tràng. Triệu chứng thường gặp có thể là đau bụng, rối loạn tiêu hóa (tiêu chảy, táo bón xen kẽ), đầy hơi, chướng bụng, và thay đổi thói quen đi ngoài.

Bạn nên đi khám tại cơ sở y tế để được chẩn đoán chính xác và tư vấn điều trị phù hợp.

Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.', 'bot', NULL, NULL, '2025-12-06 13:54:40.275', '2025-12-06 13:54:40.275');
INSERT INTO public.messages VALUES ('a4ceeb0e-e2a8-4608-b37c-8b8b4d36df2c', '201a6b45-39a9-4ffd-9529-4e76ce6871d5', 'Bệnh đái tháo đường là gì?', 'user', NULL, NULL, '2025-12-06 11:05:38.385', '2025-12-06 11:05:38.385');
INSERT INTO public.messages VALUES ('e47775b4-120d-4f00-aeec-2767b90f3567', '201a6b45-39a9-4ffd-9529-4e76ce6871d5', 'Bệnh đái tháo đường (hay tiểu đường) là một bệnh lý rối loạn chuyển hóa mạn tính, đặc trưng bởi tình trạng đường huyết (glucose trong máu) luôn ở mức cao hơn bình thường. Điều này xảy ra khi cơ thể không sản xuất đủ insulin, hoặc không sử dụng insulin một cách hiệu quả (kháng insulin), hoặc cả hai. Insulin là một hormone quan trọng giúp glucose từ thức ăn đi vào các tế bào để tạo năng lượng.

Có ba loại đái tháo đường chính:
*   **Đái tháo đường type 1:** Cơ thể không sản xuất insulin.
*   **Đái tháo đường type 2:** Cơ thể không sản xuất đủ insulin hoặc không sử dụng insulin hiệu quả.
*   **Đái tháo đường thai kỳ:** Xảy ra ở phụ nữ mang thai.

Nếu không được kiểm soát tốt, đái tháo đường có thể dẫn đến nhiều biến chứng nghiêm trọng ảnh hưởng đến tim, thận, mắt, thần kinh và mạch máu.

Bạn nên đi khám tại cơ sở y tế càng sớm càng tốt để được kiểm tra trực tiếp nếu có bất kỳ lo ngại nào về bệnh đái tháo đường.

Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.', 'bot', NULL, NULL, '2025-12-06 11:05:48.754', '2025-12-06 11:05:48.754');
INSERT INTO public.messages VALUES ('75d061a8-ac9a-4c3a-b315-47eb28d331f1', '201a6b45-39a9-4ffd-9529-4e76ce6871d5', 'Đau mắt đỏ là gì ?', 'user', NULL, NULL, '2025-12-06 11:06:34.117', '2025-12-06 11:06:34.117');
INSERT INTO public.messages VALUES ('b8761cba-8f63-47b3-ad33-26e9d85feb2f', '201a6b45-39a9-4ffd-9529-4e76ce6871d5', 'Đau mắt đỏ, hay còn gọi là viêm kết mạc, là tình trạng viêm nhiễm lớp màng trong suốt (kết mạc) bao phủ phần lòng trắng của mắt và mặt trong mí mắt.

Nguyên nhân phổ biến gây đau mắt đỏ bao gồm:
*   **Virus:** Là nguyên nhân thường gặp nhất, rất dễ lây lan.
*   **Vi khuẩn:** Cũng dễ lây lan và có thể gây ra ghèn đặc.
*   **Dị ứng:** Do tiếp xúc với các tác nhân gây dị ứng như phấn hoa, bụi, lông thú.

Các triệu chứng thường gặp là mắt đỏ, ngứa, chảy nước mắt, có ghèn (đặc biệt vào buổi sáng), cảm giác cộm xốn, và đôi khi sưng mí mắt.

Bạn nên đi khám tại cơ sở y tế càng sớm càng tốt để được kiểm tra trực tiếp, xác định nguyên nhân và có hướng điều trị phù hợp, đặc biệt nếu triệu chứng nặng, kéo dài hoặc ảnh hưởng đến thị lực.

Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.', 'bot', NULL, NULL, '2025-12-06 11:06:39.621', '2025-12-06 11:06:39.621');
INSERT INTO public.messages VALUES ('321b61b9-811d-468e-a243-346642cb75ca', 'd866ed49-6348-46c5-9ce1-b18f9353d609', 'Hà Nội ở đâu ?', 'user', NULL, NULL, '2025-12-06 11:11:51.516', '2025-12-06 11:11:51.516');
INSERT INTO public.messages VALUES ('25795495-497b-48d4-b4f9-32fb516606e6', 'd866ed49-6348-46c5-9ce1-b18f9353d609', 'Tôi cao 1.75 mét, nặng 60 kg. Tôi có đang bị suy dinh dưỡng không ?', 'user', NULL, NULL, '2025-12-06 11:12:50.249', '2025-12-06 11:12:50.249');
INSERT INTO public.messages VALUES ('4ed2498c-a158-4a4e-8391-d1ee16d6d2e9', 'd866ed49-6348-46c5-9ce1-b18f9353d609', 'Với chiều cao 1.75 mét và cân nặng 60 kg, chỉ số khối cơ thể (BMI) của bạn là khoảng 19.6.

Theo phân loại BMI thông thường, chỉ số này nằm trong ngưỡng cân nặng bình thường (18.5 - 24.9). Do đó, dựa trên chỉ số BMI, bạn không bị suy dinh dưỡng theo tiêu chí thiếu cân.

Tuy nhiên, suy dinh dưỡng không chỉ đơn thuần là thiếu cân mà còn có thể liên quan đến thiếu hụt các vi chất dinh dưỡng hoặc các vấn đề sức khỏe khác. Chỉ số BMI chỉ là một công cụ đánh giá ban đầu.

Nếu bạn có bất kỳ lo lắng nào về tình trạng dinh dưỡng hoặc sức khỏe của mình, bạn nên đi khám tại cơ sở y tế để được bác sĩ kiểm tra trực tiếp và tư vấn cụ thể hơn.

Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.', 'bot', NULL, 5, '2025-12-06 11:12:55.276', '2025-12-06 11:14:08.835');
INSERT INTO public.messages VALUES ('1d271544-5678-425d-be03-42fd2eba5097', 'd866ed49-6348-46c5-9ce1-b18f9353d609', 'Hà Nội là thủ đô của Việt Nam, nằm ở miền Bắc Việt Nam.

Tôi là chatbot chỉ trả lời các câu hỏi liên quan tới y tế, sức khỏe. Bạn hãy tập trung hỏi về y tế, sức khỏe nhé.

Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.', 'bot', NULL, 4, '2025-12-06 11:11:54.372', '2025-12-06 11:14:35.139');
INSERT INTO public.messages VALUES ('62728d48-a5e3-4a43-b0a6-f0417cc7cba5', '59a3c1ee-6e78-4266-a12c-cc4f48dd5ba0', 'Bắc Ninh ở đâu', 'user', NULL, NULL, '2025-12-06 11:14:58.555', '2025-12-06 11:14:58.555');
INSERT INTO public.messages VALUES ('4f43c9fb-7367-4df1-ace1-ecc2a51aa9df', '59a3c1ee-6e78-4266-a12c-cc4f48dd5ba0', 'Bắc Ninh là một tỉnh thuộc vùng Đồng bằng sông Hồng, Việt Nam.

Tôi là chatbot chỉ trả lời các câu hỏi liên quan tới y tế, sức khỏe. Bạn hãy tập trung hỏi về y tế, sức khỏe nhé.

Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.', 'bot', NULL, NULL, '2025-12-06 11:15:00.808', '2025-12-06 11:15:00.808');
INSERT INTO public.messages VALUES ('b51213f1-461c-40de-8261-ed33a41a8a8c', 'f459d089-247c-4e81-b010-ab50e8e3bf14', 'Các tác dụng của vitamin C', 'user', NULL, NULL, '2025-12-06 13:44:54.889', '2025-12-06 13:44:54.889');
INSERT INTO public.messages VALUES ('015f396f-9e3e-41b5-8738-5caf2b95cd63', 'f459d089-247c-4e81-b010-ab50e8e3bf14', 'Vitamin C (acid ascorbic) là một vitamin thiết yếu có nhiều tác dụng quan trọng đối với cơ thể, bao gồm:

*   **Chống oxy hóa mạnh mẽ:** Giúp bảo vệ tế bào khỏi tổn thương do các gốc tự do gây ra, từ đó giảm nguy cơ mắc các bệnh mãn tính.
*   **Tăng cường hệ miễn dịch:** Hỗ trợ chức năng của các tế bào miễn dịch, giúp cơ thể chống lại nhiễm trùng và bệnh tật.
*   **Tổng hợp collagen:** Là thành phần cần thiết để sản xuất collagen, một protein quan trọng cho da, xương, sụn, răng và mạch máu khỏe mạnh.
*   **Hỗ trợ hấp thu sắt:** Giúp cơ thể hấp thu sắt không heme (sắt từ thực vật) tốt hơn, phòng ngừa thiếu máu do thiếu sắt.
*   **Chữa lành vết thương:** Thúc đẩy quá trình lành vết thương và phục hồi mô.
*   **Bảo vệ sức khỏe tim mạch:** Có thể giúp giảm huyết áp và giảm nguy cơ mắc bệnh tim mạch.

Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.', 'bot', NULL, NULL, '2025-12-06 13:44:58.601', '2025-12-06 13:44:58.601');
INSERT INTO public.messages VALUES ('4f758b4b-a78a-4dd6-8a83-d25c861af35e', 'f459d089-247c-4e81-b010-ab50e8e3bf14', 'Các quả nào chứa nhiều vitamin C', 'user', NULL, NULL, '2025-12-06 13:46:13.71', '2025-12-06 13:46:13.71');
INSERT INTO public.messages VALUES ('4e2f390c-1d3f-4528-b3c3-485affed5407', 'f459d089-247c-4e81-b010-ab50e8e3bf14', 'Tôi hiểu lo lắng của bạn về triệu chứng này. Để được tư vấn y tế chính xác, vui lòng tham khảo ý kiến chuyên gia y tế có thể đánh giá đúng tình trạng của bạn. Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.', 'bot', NULL, NULL, '2025-12-06 13:46:18.284', '2025-12-06 13:46:18.284');
INSERT INTO public.messages VALUES ('533b22cf-d02c-4fba-9ff6-f0ad46dd9bd6', 'f459d089-247c-4e81-b010-ab50e8e3bf14', 'Bệnh ung thư đại tràng là gì', 'user', NULL, NULL, '2025-12-06 13:47:42.145', '2025-12-06 13:47:42.145');
INSERT INTO public.messages VALUES ('49fd0aaf-72a1-4b8b-b6c6-dd05c30f8e2a', 'f0100657-149e-4d6b-86a0-7cbbbd2c3543', 'Bệnh đại tràng', 'user', NULL, NULL, '2025-12-06 13:49:53.87', '2025-12-06 13:49:53.87');
INSERT INTO public.messages VALUES ('bf0dacd0-8ad2-483b-9dec-8a77d423efef', 'd6ffa0ff-2326-4fad-8e0e-8b91b1149f70', 'Bệnh đau dạ dày (hay còn gọi là viêm loét dạ dày, đau bao tử) là tình trạng niêm mạc dạ dày bị tổn thương, viêm nhiễm hoặc loét, gây ra cảm giác đau tức, khó chịu ở vùng thượng vị (vùng bụng trên rốn).

Các nguyên nhân phổ biến gây đau dạ dày bao gồm:
*   Nhiễm vi khuẩn Helicobacter pylori (HP).
*   Sử dụng thuốc giảm đau kháng viêm không steroid (NSAIDs) kéo dài.
*   Căng thẳng, stress.
*   Chế độ ăn uống không khoa học (ăn uống thất thường, ăn nhiều đồ cay nóng, chua).
*   Hút thuốc lá, uống rượu bia.

Các triệu chứng thường gặp của đau dạ dày có thể bao gồm:
*   Đau âm ỉ hoặc dữ dội ở vùng thượng vị.
*   Ợ hơi, ợ chua, nóng rát vùng ngực.
*   Buồn nôn, nôn.
*   Chán ăn, đầy bụng, khó tiêu.

Nếu bạn có các triệu chứng đau dạ dày kéo dài hoặc nghiêm trọng, bạn nên đi khám tại cơ sở y tế càng sớm càng tốt để được kiểm tra trực tiếp và chẩn đoán chính xác.

Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.', 'bot', NULL, NULL, '2025-12-10 13:06:57.456', '2025-12-10 13:06:57.456');
INSERT INTO public.messages VALUES ('0783fefb-1d10-45bc-a0e9-4a3a62a6dc23', 'd6ffa0ff-2326-4fad-8e0e-8b91b1149f70', 'Tôi thấy bị đau bụng, buồn nôn sau khi ăn và đầy hơi. Vậy tôi có thể bị bệnh gì?', 'user', NULL, NULL, '2025-12-10 13:12:25.132', '2025-12-10 13:12:25.132');
INSERT INTO public.messages VALUES ('0636ebdf-3ad7-461f-b126-2570bb152259', 'd6ffa0ff-2326-4fad-8e0e-8b91b1149f70', 'Các triệu chứng bạn mô tả như đau bụng, buồn nôn sau khi ăn và đầy hơi có thể là dấu hiệu của một số vấn đề tiêu hóa khác nhau. Một số khả năng bao gồm:

*   **Rối loạn tiêu hóa (khó tiêu chức năng):** Đây là tình trạng phổ biến, thường liên quan đến chế độ ăn uống, căng thẳng hoặc thói quen sinh hoạt.
*   **Viêm dạ dày:** Tình trạng viêm niêm mạc dạ dày.
*   **Trào ngược dạ dày thực quản (GERD):** Axit dạ dày trào ngược lên thực quản.
*   **Hội chứng ruột kích thích (IBS):** Một rối loạn chức năng của ruột, thường gây đau bụng, đầy hơi và thay đổi thói quen đi tiêu.
*   **Không dung nạp thực phẩm:** Cơ thể khó tiêu hóa một số loại thực phẩm nhất định (ví dụ: không dung nạp lactose).

Để xác định chính xác nguyên nhân và có hướng điều trị phù hợp, bạn nên đi khám tại cơ sở y tế càng sớm càng tốt để được bác sĩ kiểm tra trực tiếp, chẩn đoán và tư vấn cụ thể.

Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.', 'bot', NULL, 5, '2025-12-10 13:12:32.617', '2026-01-07 12:41:10.433');
INSERT INTO public.messages VALUES ('c68227ef-40cb-435a-af70-9ac7c00b8665', '10f51a6b-fe6a-4569-9fb3-5b70bad9eff2', 'Tôi nên mua các loại thuốc tên là gì ?', 'user', NULL, NULL, '2026-01-07 14:20:10.772', '2026-01-07 14:20:10.772');
INSERT INTO public.messages VALUES ('d96305cf-905e-4d68-9ea3-2c7b5544fca5', '10f51a6b-fe6a-4569-9fb3-5b70bad9eff2', 'Chào bạn Tuấn,

Việc uống nước chanh ấm và súc miệng bằng nước muối vào buổi sáng là những biện pháp hỗ trợ rất tốt để làm dịu các triệu chứng ho, đau họng và sổ mũi mà bạn đang gặp phải.

*   **Uống nước chanh:** Nước chanh cung cấp vitamin C, giúp tăng cường sức đề kháng của cơ thể. Khi pha với nước ấm, nó còn giúp làm dịu cổ họng, giữ ẩm cho đường hô hấp và làm loãng đờm, từ đó có thể giúp giảm ho và cảm giác khó chịu ở họng.
*   **Súc miệng bằng nước muối:** Nước muối sinh lý có tác dụng sát khuẩn nhẹ, giúp làm sạch khoang miệng và họng, loại bỏ bớt vi khuẩn hoặc virus, giảm viêm và làm dịu cảm giác đau rát họng.

Những biện pháp này có thể giúp bạn cảm thấy dễ chịu hơn và hỗ trợ quá trình hồi phục của cơ thể. Tuy nhiên, chúng là các biện pháp hỗ trợ và không thay thế cho việc điều trị nguyên nhân gây bệnh. Để đạt hiệu quả tốt nhất, bạn nên duy trì thực hiện đều đặn, kết hợp với việc nghỉ ngơi đầy đủ, giữ ấm cơ thể và uống đủ nước.

Nếu các triệu chứng không cải thiện hoặc trở nên nặng hơn, bạn nên tham khảo ý kiến bác sĩ để được chẩn đoán và tư vấn điều trị phù hợp.

Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.', 'bot', NULL, NULL, '2026-01-07 14:21:13.829', '2026-01-07 14:21:13.829');
INSERT INTO public.messages VALUES ('5155727f-6f11-43a4-a0a9-5dfa25f8032d', '0f5040b3-c160-4ffc-b1b5-2c364e0ed9ce', 'chào bạn', 'user', NULL, NULL, '2026-01-08 06:27:09.752', '2026-01-08 06:27:09.752');
INSERT INTO public.messages VALUES ('d3ec3066-946f-470b-a0f7-842578861245', 'd6a1e0c0-db9b-4448-80bd-47f60a0dea78', 'Chào bạn,

Thông tin y tế tham khảo được cung cấp không đề cập đến thuốc Omeprazole 20mg. Do đó, tôi sẽ sử dụng kiến thức y khoa phổ thông để trả lời câu hỏi của bạn.

Thuốc Omeprazole 20mg thuộc nhóm thuốc ức chế bơm proton (PPI), có tác dụng làm giảm lượng axit được sản xuất trong dạ dày. Thuốc này thường được dùng để điều trị các tình trạng sau:

*   **Bệnh trào ngược dạ dày - thực quản (GERD):** Giúp giảm các triệu chứng ợ nóng, ợ chua và chữa lành tổn thương thực quản do axit dạ dày gây ra.
*   **Loét dạ dày và loét tá tràng:** Giúp chữa lành vết loét và ngăn ngừa tái phát.
*   **Hội chứng Zollinger-Ellison:** Một tình trạng hiếm gặp gây sản xuất quá nhiều axit dạ dày.
*   **Viêm thực quản ăn mòn:** Tình trạng viêm và tổn thương thực quản do axit dạ dày.
*   **Phòng ngừa loét dạ dày do sử dụng thuốc chống viêm không steroid (NSAID):** Ở những người có nguy cơ cao.

Việc sử dụng thuốc Omeprazole 20mg cần theo chỉ định và hướng dẫn của bác sĩ để đảm bảo an toàn và hiệu quả.

Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.', 'bot', NULL, NULL, '2026-01-08 06:47:16.322', '2026-01-08 06:47:16.322');
INSERT INTO public.messages VALUES ('926e237d-bfbf-4c58-b2c4-a9915d7650bf', 'b604fca5-e05e-40a3-8aab-55bacf663f7e', 'Chào bạn,

Tôi hiểu bạn đang cảm thấy hồi hộp và chóng mặt. Đây là những triệu chứng có thể xuất phát từ nhiều nguyên nhân khác nhau, từ những tình trạng tương đối lành tính như căng thẳng, thiếu ngủ, mất nước, hạ đường huyết nhẹ, đến những vấn đề sức khỏe nghiêm trọng hơn liên quan đến tim mạch (như rối loạn nhịp tim), huyết áp, thiếu máu, hoặc các vấn đề thần kinh.

Là một chatbot, tôi không thể chẩn đoán bệnh hay đưa ra lời khuyên y tế cụ thể cho tình trạng của bạn. Để xác định chính xác nguyên nhân và có hướng xử lý phù hợp, bạn nên đi khám bác sĩ càng sớm càng tốt. Bác sĩ sẽ thăm khám, hỏi rõ hơn về các triệu chứng, tiền sử bệnh lý và có thể yêu cầu làm các xét nghiệm cần thiết để đưa ra chẩn đoán chính xác nhất.

Các thông tin mà chatbot cung cấp chỉ mang tính chất tham khảo. Hãy thật cẩn thận với các thông tin này.

---
 **Nguồn tham khảo:** AI Medical Knowledge', 'bot', NULL, NULL, '2026-01-09 08:46:16.905', '2026-01-09 08:46:16.905');
INSERT INTO public.messages VALUES ('0d102204-a798-4b44-8e83-9786cbba4b86', 'b604fca5-e05e-40a3-8aab-55bacf663f7e', 'Tôi nên mua những loại thuốc gì ?', 'user', NULL, NULL, '2026-01-09 08:47:56.886', '2026-01-09 08:47:56.886');


--
-- TOC entry 5418 (class 0 OID 22945)
-- Dependencies: 222
-- Data for Name: names; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.names VALUES ('Nguyễn', 'Minh Hồng', '23078f0b-a5e9-4c90-84d4-e0738552033a');
INSERT INTO public.names VALUES ('Nguyễn', 'Minh Tuấn', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c');
INSERT INTO public.names VALUES ('Nguyễn', 'Minh Tú', '698259b2-f399-45c1-b673-b2721cf0ea16');
INSERT INTO public.names VALUES ('Trần', 'Thị Mai', '61a78a93-ca60-4f23-921b-10ff69883f25');
INSERT INTO public.names VALUES ('Lê', 'Thị Hồng', '422d8921-79bc-4dd8-99ae-c7858471798a');
INSERT INTO public.names VALUES ('Phạm', 'Hồng Nhung', 'f470d774-c3d1-48eb-bc77-eb0159621190');
INSERT INTO public.names VALUES ('Nguyễn', 'Thị Lan', 'eb0d5ec2-cd89-4034-bfbf-c33717d8c9f4');
INSERT INTO public.names VALUES ('Lê', 'Văn Hùng', 'a392675f-8c93-41d2-bde3-e42141e76cef');
INSERT INTO public.names VALUES ('Trần', 'Quốc Anh', '2e335910-80af-443b-a1a3-3be509ae1b4d');
INSERT INTO public.names VALUES ('Đỗ', 'Thị Lan', 'd7cb3ba8-4ac2-44e6-bfca-02b185a75730');
INSERT INTO public.names VALUES ('Phạm', 'Văn Dũng', 'ecf73bd5-3066-48ec-bfa2-88dd85ad98cf');
INSERT INTO public.names VALUES ('Hoàng', 'Văn Nam', '4ed76fa3-ae06-47ab-94f3-d531a180b952');
INSERT INTO public.names VALUES ('Nguyễn', 'Thị Thu', 'd736450a-deca-4f2d-9c22-8480849814ba');
INSERT INTO public.names VALUES ('Vũ', 'Thị Hồng', 'e09c8604-abe4-48a3-83ea-895cbaeb24c9');
INSERT INTO public.names VALUES ('Đặng', 'Văn Long', 'e55f2173-06f4-4fe1-ad97-ae963755ea33');
INSERT INTO public.names VALUES ('Nguyễn Đình', 'Tú', '4de0fd7f-1696-4945-9549-22ae13666300');
INSERT INTO public.names VALUES ('Nguyễn Minh', 'Tuấn', '06f472db-0bfd-4a08-b23f-e44f2bc14330');
INSERT INTO public.names VALUES ('Nguyễn Minh', 'Sơn', 'e29c3065-9964-4767-9d25-dc0173fe8978');
INSERT INTO public.names VALUES ('Nguyễn', 'Minh Tuấn', '3f3ab543-09d5-475b-8e57-366330d4f400');
INSERT INTO public.names VALUES ('Nguyễn', 'Tuấn', '57018bfc-c48e-4725-bd80-76f7158f9184');
INSERT INTO public.names VALUES ('Hoàng Thị', 'Hằng', 'cf5f6586-3f10-4bdf-a9d5-525f76c69382');


--
-- TOC entry 5449 (class 0 OID 23227)
-- Dependencies: 253
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.notifications VALUES ('f145d59d-4430-4eb1-98bb-077c801f41bd', '4de0fd7f-1696-4945-9549-22ae13666300', 'Thông báo lịch khám', 'Bạn đã có lịch khám vào ngày mai. Vui lòng đến đúng giờ.', false, false, '2025-10-23 16:18:28.591', '2025-10-23 16:18:28.591', NULL);
INSERT INTO public.notifications VALUES ('272d72bd-3821-4707-ae15-33f64b2e907f', '4de0fd7f-1696-4945-9549-22ae13666300', 'Thông báo hủy lịch khám', 'Bệnh viện đã hủy lịch khám của bạn. Vui lòng liên hệ với bệnh viện để biết thêm thông tin.', false, false, '2025-10-23 16:18:28.591', '2025-10-23 16:18:28.591', NULL);
INSERT INTO public.notifications VALUES ('727e23d3-1e3d-4099-b72f-66a7a2911cfb', '4de0fd7f-1696-4945-9549-22ae13666300', 'Thông báo chương trình ưu đãi', 'Bệnh viện đang có chương trình ưu đãi cho các bệnh nhân. Vui lòng đến khám để được hưởng ưu đãi.', false, false, '2025-10-23 16:18:28.591', '2025-10-23 16:18:28.591', NULL);
INSERT INTO public.notifications VALUES ('fc764f54-d3ee-4987-a9fe-aa012dc8e4f0', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Thông báo lịch khám', 'Bạn đã có lịch khám vào ngày mai. Vui lòng đến đúng giờ.', true, false, '2025-10-23 16:18:28.566', '2025-12-19 16:40:19.634', NULL);
INSERT INTO public.notifications VALUES ('c32a8152-b9e8-4851-a3c8-a5709d12d071', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Thông báo hủy lịch khám', 'Bệnh viện đã hủy lịch khám của bạn. Vui lòng liên hệ với bệnh viện để biết thêm thông tin.', true, false, '2025-10-23 16:18:28.566', '2025-12-19 16:40:19.634', NULL);
INSERT INTO public.notifications VALUES ('53872967-0ae9-4a35-acae-1d0e3360f0b2', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 08:30:00 29/12/2025', false, false, '2025-12-29 06:38:04.885', '2025-12-29 06:38:04.885', 'appointment_new');
INSERT INTO public.notifications VALUES ('f1f0e2e8-9078-4a5b-8746-13890548c093', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Thông báo chương trình ưu đãi', 'Bệnh viện đang có chương trình ưu đãi cho các bệnh nhân. Vui lòng đến khám để được hưởng ưu đãi.', true, true, '2025-10-23 16:18:28.566', '2025-12-19 17:07:51.946', NULL);
INSERT INTO public.notifications VALUES ('a1204fc7-4040-41e3-b4f6-5cf7e3836d80', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 08:00:00 21/12/2025', false, false, '2025-12-19 17:19:40.073', '2025-12-19 17:19:40.073', 'appointment_new');
INSERT INTO public.notifications VALUES ('aad60929-c633-4728-a4be-de59fd87552f', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 09:00:00 29/12/2025', false, false, '2025-12-29 05:07:46.914', '2025-12-29 05:07:46.914', 'appointment_new');
INSERT INTO public.notifications VALUES ('b07bbada-0832-469a-a96a-15cc0b733a3a', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 00:30:00 29/12/2025', false, false, '2025-12-29 05:46:42.198', '2025-12-29 05:46:42.198', 'appointment_new');
INSERT INTO public.notifications VALUES ('32873387-50a4-4302-abc7-782600db97da', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 06:00:00 29/12/2025', false, false, '2025-12-29 06:37:29.692', '2025-12-29 06:37:29.692', 'appointment_new');
INSERT INTO public.notifications VALUES ('d951b276-f649-4f1d-9849-4bf2f1d92a80', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 11:30:00 29/12/2025', false, false, '2025-12-29 06:39:45.882', '2025-12-29 06:39:45.882', 'appointment_new');
INSERT INTO public.notifications VALUES ('a24d1efc-a37a-4d9b-9c47-42ce4b5ef700', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 13:00:00 29/12/2025', false, false, '2025-12-29 06:48:05.65', '2025-12-29 06:48:05.65', 'appointment_new');
INSERT INTO public.notifications VALUES ('f185f4a2-af47-4acf-ac35-560e381f6092', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 14:00:00 29/12/2025', false, false, '2025-12-29 06:55:54.952', '2025-12-29 06:55:54.952', 'appointment_new');
INSERT INTO public.notifications VALUES ('96a60ec8-9bf5-4644-92d0-c5e8c3eb7ff2', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 10:00:00 29/12/2025', false, false, '2025-12-29 07:04:31.967', '2025-12-29 07:04:31.967', 'appointment_new');
INSERT INTO public.notifications VALUES ('65e79bec-1ce4-4437-93e3-db2f41a95a82', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Lịch hẹn đã được xác nhận', 'Lịch hẹn của bạn đã được xác nhận. Vui lòng đến khám bệnh vào lúc 00:30:00 29/12/2025', false, false, '2025-12-29 17:24:20.823', '2025-12-29 17:24:20.823', 'appointment_confirmed');
INSERT INTO public.notifications VALUES ('a969cae1-b5b9-48d6-8c38-57c2ffd3e001', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 11:30:00 30/12/2025', false, false, '2025-12-29 18:02:42.177', '2025-12-29 18:02:42.177', 'appointment_new');
INSERT INTO public.notifications VALUES ('6f49ad5e-0138-444a-9ff0-64008a7d795b', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Lịch hẹn đã được xác nhận', 'Lịch hẹn của bạn đã được xác nhận. Vui lòng đến khám bệnh vào lúc 11:30:00 30/12/2025', false, false, '2025-12-30 10:32:03.721', '2025-12-30 10:32:03.721', 'appointment_confirmed');
INSERT INTO public.notifications VALUES ('c3407452-9a3a-4f30-aa36-91d504ac72d4', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 11:00:00 3/1/2026', false, false, '2026-01-03 05:26:16.933', '2026-01-03 05:26:16.933', 'appointment_new');
INSERT INTO public.notifications VALUES ('f431c0a3-0a00-48e9-9658-ffccc3d93c8d', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 18:00:00 3/1/2026', false, false, '2026-01-03 05:27:40.663', '2026-01-03 05:27:40.663', 'appointment_new');
INSERT INTO public.notifications VALUES ('2429cf49-2fee-438a-a077-a9b827ce0127', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 12:30:00 8/1/2026', false, false, '2026-01-08 04:51:34.753', '2026-01-08 04:51:34.753', 'appointment_new');
INSERT INTO public.notifications VALUES ('035e78e1-b91f-4713-916c-92b7547a3006', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 12:00:00 8/1/2026', false, false, '2026-01-08 04:52:18.255', '2026-01-08 04:52:18.255', 'appointment_new');
INSERT INTO public.notifications VALUES ('3126f1be-ceba-43c4-b5e0-707d1caea3d9', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 12:00:00 14/1/2026', false, false, '2026-01-08 06:14:02.097', '2026-01-08 06:14:02.097', 'appointment_new');
INSERT INTO public.notifications VALUES ('39a5d600-5324-4b08-9c0e-a9e5f88b6e66', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Lịch hẹn đã được xác nhận', 'Lịch hẹn của bạn đã được xác nhận. Vui lòng đến khám bệnh vào lúc 12:00:00 8/1/2026', false, true, '2026-01-08 05:18:02.388', '2026-01-08 06:17:43.46', 'appointment_confirmed');
INSERT INTO public.notifications VALUES ('d3103533-8953-44d7-95e1-9e01a9550cb8', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 10:30:00 14/1/2026', false, false, '2026-01-08 06:32:05.382', '2026-01-08 06:32:05.382', 'appointment_new');
INSERT INTO public.notifications VALUES ('736bfabd-2ec3-4083-8e8b-a05234ab1bb0', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Lịch hẹn đã được xác nhận', 'Lịch hẹn của bạn đã được xác nhận. Vui lòng đến khám bệnh vào lúc 12:30:00 8/1/2026', false, false, '2026-01-08 06:32:36.519', '2026-01-08 06:32:36.519', 'appointment_confirmed');
INSERT INTO public.notifications VALUES ('cf33dae5-454f-420d-945a-2d7b31bf4187', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 11:00:00 14/1/2026', false, false, '2026-01-08 06:39:30.069', '2026-01-08 06:39:30.069', 'appointment_new');
INSERT INTO public.notifications VALUES ('78697aff-b7e2-409e-85a0-577d2c5c36a9', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Lịch hẹn bị từ chối', 'Lịch hẹn của bạn đã bị từ chối. Lý do: Trùng lịch', false, true, '2026-01-08 06:42:41.189', '2026-01-08 07:01:20.256', 'appointment_rejected');
INSERT INTO public.notifications VALUES ('c7b306f8-844a-4294-86ac-8937256f92ab', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 11:30:00 14/1/2026', false, false, '2026-01-08 13:50:15.316', '2026-01-08 13:50:15.316', 'appointment_new');
INSERT INTO public.notifications VALUES ('fce019d6-a446-46f7-a0b5-a0cf88893fcc', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Lịch hẹn bị từ chối', 'Lịch hẹn của bạn đã bị từ chối. Lý do: Trùng lịch', false, true, '2026-01-08 06:40:38.197', '2026-01-08 13:57:17.973', 'appointment_rejected');
INSERT INTO public.notifications VALUES ('4ece409b-bcee-43a0-86c2-512fcfa7eb7d', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 12:30:00 9/1/2026', false, false, '2026-01-09 05:23:34.098', '2026-01-09 05:23:34.098', 'appointment_new');
INSERT INTO public.notifications VALUES ('72440b77-0809-4449-9149-7f643134a930', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 10:00:00 12/1/2026', false, false, '2026-01-09 05:25:36.088', '2026-01-09 05:25:36.088', 'appointment_new');
INSERT INTO public.notifications VALUES ('f15542a5-5d95-4bc1-b09f-7818f9f4dd06', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Lịch hẹn đã được xác nhận', 'Lịch hẹn của bạn đã được xác nhận. Vui lòng đến khám bệnh vào lúc 12:30:00 9/1/2026', false, false, '2026-01-09 05:26:22.078', '2026-01-09 05:26:22.078', 'appointment_confirmed');
INSERT INTO public.notifications VALUES ('06282c81-6a68-455c-baed-039ae3f30921', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 10:30:00 12/1/2026', false, false, '2026-01-09 07:19:30.63', '2026-01-09 07:19:30.63', 'appointment_new');
INSERT INTO public.notifications VALUES ('b8facfea-599f-4429-a943-f9c93ca481ee', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Lịch hẹn đã được xác nhận', 'Lịch hẹn của bạn đã được xác nhận. Vui lòng đến khám bệnh vào lúc 10:00:00 12/1/2026', false, false, '2026-01-09 07:20:54.19', '2026-01-09 07:20:54.19', 'appointment_confirmed');
INSERT INTO public.notifications VALUES ('24109ec7-e79f-416c-b507-fd55e657e7cb', '2e335910-80af-443b-a1a3-3be509ae1b4d', 'Lịch hẹn mới', 'Bênh nhân Nguyễn Minh Sơn đã đặt lịch khám lúc 07:00:00 12/1/2026', false, false, '2026-01-09 08:51:20.816', '2026-01-09 08:51:20.816', 'appointment_new');
INSERT INTO public.notifications VALUES ('577c7065-36a3-471f-b4ad-89661990f136', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'Lịch hẹn đã được xác nhận', 'Lịch hẹn của bạn đã được xác nhận. Vui lòng đến khám bệnh vào lúc 07:00:00 12/1/2026', false, false, '2026-01-09 08:51:58.34', '2026-01-09 08:51:58.34', 'appointment_confirmed');


--
-- TOC entry 5428 (class 0 OID 23010)
-- Dependencies: 232
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.patients VALUES ('e29c3065-9964-4767-9d25-dc0173fe8978', 'PAT001');
INSERT INTO public.patients VALUES ('4de0fd7f-1696-4945-9549-22ae13666300', 'PAT002');
INSERT INTO public.patients VALUES ('06f472db-0bfd-4a08-b23f-e44f2bc14330', 'PAT003');
INSERT INTO public.patients VALUES ('57018bfc-c48e-4725-bd80-76f7158f9184', 'PAT004');
INSERT INTO public.patients VALUES ('cf5f6586-3f10-4bdf-a9d5-525f76c69382', 'PAT005');
INSERT INTO public.patients VALUES ('23078f0b-a5e9-4c90-84d4-e0738552033a', 'PAT006');


--
-- TOC entry 5440 (class 0 OID 23145)
-- Dependencies: 244
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.payments VALUES ('b926c322-0671-4dad-9863-580311be55a2', '3ee3642b-8364-4a82-9a7d-79bfb7ba40b2', 'VNPay - NCB', 'bank_transfer', 1137600, 'completed', '2026-01-09 04:37:01.884', '2026-01-09 04:37:01.884', 'Giao dịch thành công', '{"vnp_TxnRef": "1767933360601667021", "vnp_PayDate": "20260109113447", "vnp_BankCode": "NCB", "vnp_ResponseCode": "00", "vnp_TransactionNo": "15388083", "vnp_TransactionStatus": "00"}');
INSERT INTO public.payments VALUES ('d3fe1b54-191c-4791-a78b-b10d10966213', 'f3ec5081-89b9-42b8-a459-5522332bbc13', NULL, 'cash_on_delivery', 100000, 'completed', '2026-01-09 05:38:51.695', '2026-01-09 05:38:51.695', NULL, 'null');


--
-- TOC entry 5442 (class 0 OID 23165)
-- Dependencies: 246
-- Data for Name: prescriptions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.prescriptions VALUES ('df19c448-dd7b-4cff-9158-d741d95d45c1', true, '2026-01-06 20:17:25.439', '2026-01-09 04:37:01.897', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed37');
INSERT INTO public.prescriptions VALUES ('ffd387a3-68d1-4aac-8043-419be3304b2b', true, '2026-01-06 22:00:03.663', '2026-01-09 04:37:01.897', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed37');
INSERT INTO public.prescriptions VALUES ('e3edd5f3-7c7b-4abe-92ca-c5d77539ed35', true, '2025-12-30 13:22:08.077', '2026-01-09 04:37:01.897', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed35');
INSERT INTO public.prescriptions VALUES ('4b3c7e52-a3f7-4bea-952f-ec8c34589c58', true, '2026-01-09 05:36:29.896', '2026-01-09 05:38:51.704', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '40e91844-2ff7-4c02-8109-d3ec05992de0');


--
-- TOC entry 5414 (class 0 OID 22906)
-- Dependencies: 218
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.roles VALUES (1, 'patient', 'PAT');
INSERT INTO public.roles VALUES (2, 'doctor', 'DOC');
INSERT INTO public.roles VALUES (3, 'admin', 'ADM');
INSERT INTO public.roles VALUES (4, 'pharmacist', 'PHA');
INSERT INTO public.roles VALUES (5, 'accountant', 'ACC');


--
-- TOC entry 5434 (class 0 OID 23077)
-- Dependencies: 238
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.rooms VALUES ('4be581fd-1616-4f54-b817-444b5c6bc3ae', '6095fa30-8753-44ce-9729-45cd9edb27bf', 'Phòng khám 1', 101, 1, 'examination', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('c5045d11-2ecf-4a76-abda-15fda13e7e9c', '6095fa30-8753-44ce-9729-45cd9edb27bf', 'Phòng khám 2', 102, 1, 'examination', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('22eacd01-1bb8-4827-a29b-0569e28a9619', '6095fa30-8753-44ce-9729-45cd9edb27bf', 'Phòng khám 3', 103, 1, 'examination', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('3c034557-0af9-4ef8-849e-8f2139df2183', '6095fa30-8753-44ce-9729-45cd9edb27bf', 'Phòng khám 4', 104, 1, 'examination', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('32c48b93-0a02-45c6-b528-2a2c4da98649', '6095fa30-8753-44ce-9729-45cd9edb27bf', 'Phòng khám 5', 201, 2, 'examination', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('53c7f03e-8283-4bbd-b610-b278fbde9d58', '6095fa30-8753-44ce-9729-45cd9edb27bf', 'Phòng khám 6', 202, 2, 'examination', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('c0c4264a-9b04-4fe0-8713-5523877ecdf2', '6095fa30-8753-44ce-9729-45cd9edb27bf', 'Phòng khám 7', 203, 2, 'examination', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('c2acfc24-536f-4838-bd26-99fbd467b4cc', '6095fa30-8753-44ce-9729-45cd9edb27bf', 'Phòng khám 8', 204, 2, 'examination', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('409ecea3-6201-4b4a-8796-797c90b6846f', '6095fa30-8753-44ce-9729-45cd9edb27bf', 'Phòng khám 9', 301, 3, 'examination', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('b36334f6-4c2f-4a0c-9dc9-436830047fae', '6095fa30-8753-44ce-9729-45cd9edb27bf', 'Phòng khám 10', 302, 3, 'examination', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('2d4d23d8-278f-4602-9a31-562fdcc71b50', '6095fa30-8753-44ce-9729-45cd9edb27bf', 'Phòng khám 11', 303, 3, 'examination', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('fa4b1095-fcf9-4650-9cf8-5f08d54adc17', '6095fa30-8753-44ce-9729-45cd9edb27bf', 'Phòng khám 12', 304, 3, 'examination', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('46f7d37b-5d05-4875-b912-8537e771737e', '6095fa30-8753-44ce-9729-45cd9edb27bf', 'Phòng khám 13', 401, 4, 'examination', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('df46cc2a-fcdc-4dea-b528-5368569e1949', '6095fa30-8753-44ce-9729-45cd9edb27bf', 'Phòng khám 15', 501, 4, 'examination', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'not_used');
INSERT INTO public.rooms VALUES ('6c5cc956-250e-4e19-8d81-f1ab5eb9264d', 'd2c23f3e-1309-4b36-88d9-4db6e8286e3c', 'Phòng điều trị 1', 101, 1, 'patient_ward', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('df348ee1-625b-4942-a972-8a09afad8922', 'd2c23f3e-1309-4b36-88d9-4db6e8286e3c', 'Phòng điều trị 2', 102, 1, 'patient_ward', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('07969572-66ee-47fd-8863-a594d0087007', 'd2c23f3e-1309-4b36-88d9-4db6e8286e3c', 'Phòng điều trị 3', 103, 1, 'patient_ward', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('31fe66cb-8052-4a87-a575-5cafa0d40089', 'd2c23f3e-1309-4b36-88d9-4db6e8286e3c', 'Phòng điều trị 4', 104, 1, 'patient_ward', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('aed8deec-7d52-4680-90c1-0d5a8e438a35', 'd2c23f3e-1309-4b36-88d9-4db6e8286e3c', 'Phòng điều trị 5', 201, 2, 'patient_ward', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('d4733442-9ad3-47e3-b41a-7bcd5aee1d61', 'd2c23f3e-1309-4b36-88d9-4db6e8286e3c', 'Phòng điều trị 6', 202, 2, 'patient_ward', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('360eb7ba-f052-4c4f-a0ee-1fc159bfdff0', 'd2c23f3e-1309-4b36-88d9-4db6e8286e3c', 'Phòng điều trị 7', 203, 2, 'patient_ward', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('bf437951-60bc-4f60-ae19-00ebc07ab4e8', 'd2c23f3e-1309-4b36-88d9-4db6e8286e3c', 'Phòng điều trị 8', 204, 2, 'patient_ward', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('d5a08784-add7-4235-9f5f-5efaf1082fc3', 'd2c23f3e-1309-4b36-88d9-4db6e8286e3c', 'Phòng điều trị 9', 301, 3, 'patient_ward', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('eaefb43a-28f7-4241-b4da-ec40f5ab1f05', 'd2c23f3e-1309-4b36-88d9-4db6e8286e3c', 'Phòng điều trị 10', 302, 3, 'patient_ward', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('b672859a-bd41-4751-aa74-b321c1899ade', 'd2c23f3e-1309-4b36-88d9-4db6e8286e3c', 'Phòng điều trị 11', 303, 3, 'patient_ward', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('0a70da0b-cd25-4363-9b64-c0f94cfa5d0b', 'd2c23f3e-1309-4b36-88d9-4db6e8286e3c', 'Phòng điều trị 12', 304, 3, 'patient_ward', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('c6e30db5-a480-4161-9833-8ffde00552ec', 'd2c23f3e-1309-4b36-88d9-4db6e8286e3c', 'Phòng điều trị 13', 401, 4, 'patient_ward', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('e5a7e318-a2b5-4b6f-98bc-e0eed40ba793', 'd2c23f3e-1309-4b36-88d9-4db6e8286e3c', 'Phòng điều trị 14', 501, 5, 'patient_ward', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'not_used');
INSERT INTO public.rooms VALUES ('f1679761-98bf-4bf4-a82f-73dc801470cb', '1388bb07-05e6-4a67-8a04-80e8677cd671', 'Văn phòng 1', 101, 1, 'office', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('2016170a-c3fd-499f-9d16-99a21e216945', '1388bb07-05e6-4a67-8a04-80e8677cd671', 'Văn phòng 2', 102, 1, 'office', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('2a1dd88b-fc72-46df-8505-4ca7ab890dc2', '1388bb07-05e6-4a67-8a04-80e8677cd671', 'Văn phòng 3', 103, 1, 'office', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('698f8e66-7aba-4c7f-8f35-807fc18df098', '1388bb07-05e6-4a67-8a04-80e8677cd671', 'Văn phòng 4', 104, 1, 'office', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('f2f2a93a-dec3-44a8-a108-4f311f5d9cb8', '1388bb07-05e6-4a67-8a04-80e8677cd671', 'Văn phòng 5', 201, 2, 'office', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('d0c92335-e8d7-4379-a17e-6f42be5f87c2', '1388bb07-05e6-4a67-8a04-80e8677cd671', 'Văn phòng 6', 202, 2, 'office', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('dd6ac462-6934-4c8b-81f1-7a0994bdb187', '1388bb07-05e6-4a67-8a04-80e8677cd671', 'Văn phòng 7', 203, 2, 'office', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('f4b552b4-a0ff-4422-a0f1-f0885864ab73', '1388bb07-05e6-4a67-8a04-80e8677cd671', 'Văn phòng 8', 204, 2, 'office', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('ede1a1d8-a04d-4e18-a5d8-4384ea46ff06', '1388bb07-05e6-4a67-8a04-80e8677cd671', 'Văn phòng 9', 301, 3, 'office', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('f9ba46b7-4b59-4a40-a35a-e107d293ee8f', '1388bb07-05e6-4a67-8a04-80e8677cd671', 'Văn phòng 10', 302, 3, 'office', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('2ec21ea5-b67b-4e36-a2db-7a6130ab9cf1', '1388bb07-05e6-4a67-8a04-80e8677cd671', 'Văn phòng 11', 303, 3, 'office', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('e1a631b0-ca20-4184-a10e-01a31f5675a3', '1388bb07-05e6-4a67-8a04-80e8677cd671', 'Văn phòng 12', 304, 3, 'office', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');
INSERT INTO public.rooms VALUES ('e3b5a1e2-3ba5-4465-bad3-ec77cfad56c9', '1388bb07-05e6-4a67-8a04-80e8677cd671', 'Văn phòng 14', 306, 3, 'office', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'not_used');
INSERT INTO public.rooms VALUES ('b8eef109-e6fc-4f28-be30-c1ed5c7ca6ba', '1388bb07-05e6-4a67-8a04-80e8677cd671', 'Văn phòng 13', 305, 3, 'office', '2025-10-24 04:28:33.529', '2025-10-24 04:28:33.529', 'used');


--
-- TOC entry 5435 (class 0 OID 23085)
-- Dependencies: 239
-- Data for Name: schedules; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.schedules VALUES ('e3edd5f3-7c7b-4abe-92ca-c5d77539ed35', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 1, 'work', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2025-12-08 00:00:00', 'confirmed', 10, '2025-12-08 07:00:00', '2025-12-08 13:00:00', '2025-12-07 01:04:55.605', '2025-12-07 01:06:56.634');
INSERT INTO public.schedules VALUES ('5a9da013-0d56-42b7-b804-766df501a4bf', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 1, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-10 00:00:00', 'pending', 10, '2026-01-10 00:00:00', '2026-01-10 06:00:00', '2026-01-07 14:00:14.344', '2026-01-07 14:00:14.344');
INSERT INTO public.schedules VALUES ('e3edd5f3-7c7b-4abe-92ca-c5d77539ed36', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 1, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2025-12-10 00:00:00', 'confirmed', 10, '2025-12-10 01:00:00', '2025-12-10 10:00:00', '2025-12-07 01:04:55.605', '2025-12-07 01:06:56.634');
INSERT INTO public.schedules VALUES ('e3edd5f3-7c7b-4abe-92ca-c5d77539ed37', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 1, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2025-12-21 00:00:00', 'confirmed', 10, '2025-12-21 01:00:00', '2025-12-21 10:00:00', '2025-12-07 01:04:55.605', '2025-12-07 01:06:56.634');
INSERT INTO public.schedules VALUES ('853ca195-cc7f-4bac-acf2-6f806797c1c8', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 1, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-13 00:00:00', 'pending', 10, '2026-01-13 00:00:00', '2026-01-13 06:00:00', '2026-01-07 14:00:22.372', '2026-01-07 14:00:22.372');
INSERT INTO public.schedules VALUES ('54e21d37-cfd7-4c05-b4c8-abaf59dd1f22', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 1, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-08 00:00:00', 'confirmed', 10, '2026-01-08 00:00:00', '2026-01-08 06:00:00', '2026-01-07 13:59:49.429', '2026-01-07 14:04:10.06');
INSERT INTO public.schedules VALUES ('6fd377a6-5e07-420f-892c-80f3cf4b7cb7', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 1, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-14 00:00:00', 'confirmed', 10, '2026-01-14 00:00:00', '2026-01-14 06:00:00', '2026-01-08 06:09:32.946', '2026-01-08 06:13:48.998');
INSERT INTO public.schedules VALUES ('e3edd5f3-7c7b-4abe-92ca-c5d77539ed38', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 1, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2025-12-28 16:00:00', 'confirmed', 10, '2025-12-27 18:00:00', '2025-12-30 10:00:00', '2025-12-07 01:04:55.605', '2025-12-07 01:06:56.634');
INSERT INTO public.schedules VALUES ('654c2ad5-2998-4bef-89e1-dca828113dd6', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 1, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-02 00:00:00', 'confirmed', 10, '2026-01-02 07:00:00', '2026-01-02 13:00:00', '2026-01-01 14:25:31.606', '2026-01-01 14:26:28.325');
INSERT INTO public.schedules VALUES ('39f02ccf-16e0-467a-88f3-91b6e5c4265e', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 1, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-15 00:00:00', 'pending', 10, '2026-01-15 00:00:00', '2026-01-15 06:00:00', '2026-01-08 13:54:28.346', '2026-01-08 13:54:28.346');
INSERT INTO public.schedules VALUES ('8d7512ab-3c47-4d57-b6c5-9c52e3c008a5', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 1, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-04 00:00:00', 'pending', 10, '2026-01-04 07:00:00', '2026-01-04 13:00:00', '2026-01-03 03:45:25.173', '2026-01-03 03:45:25.173');
INSERT INTO public.schedules VALUES ('a221a762-e2a2-40ae-8e76-610e3d541703', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 1, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-03 00:00:00', 'confirmed', 10, '2026-01-03 04:00:00', '2026-01-03 12:00:00', '2026-01-03 03:37:24.506', '2026-01-03 03:39:35.576');
INSERT INTO public.schedules VALUES ('2da83641-3c15-4293-8020-0c06021942a1', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 1, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-06 00:00:00', 'pending', 10, '2026-01-06 00:00:00', '2026-01-06 06:00:00', '2026-01-03 03:53:56.978', '2026-01-03 03:53:56.978');
INSERT INTO public.schedules VALUES ('ee3a4935-0f4b-4e1d-9137-82ab5073e990', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 1, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-16 00:00:00', 'pending', 10, '2026-01-16 06:00:00', '2026-01-16 12:00:00', '2026-01-08 19:17:46.74', '2026-01-08 19:17:46.74');
INSERT INTO public.schedules VALUES ('03374059-6bb1-44d8-bf35-ef7f0f6ff3ec', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 1, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-17 00:00:00', 'pending', 10, '2026-01-17 06:00:00', '2026-01-17 12:00:00', '2026-01-08 19:18:16.93', '2026-01-08 19:18:16.93');
INSERT INTO public.schedules VALUES ('15017972-ba78-4270-ab23-b68aded2a400', '698259b2-f399-45c1-b673-b2721cf0ea16', 1, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-12 00:00:00', 'confirmed', 10, '2026-01-12 00:00:00', '2026-01-12 06:00:00', '2026-01-08 19:35:19.235', '2026-01-08 19:35:19.235');
INSERT INTO public.schedules VALUES ('15017972-ba78-4270-ab23-b68aded2a401', '61a78a93-ca60-4f23-921b-10ff69883f25', 2, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-12 00:00:00', 'confirmed', 10, '2026-01-12 00:00:00', '2026-01-12 06:00:00', '2026-01-08 19:35:19.235', '2026-01-08 19:35:19.235');
INSERT INTO public.schedules VALUES ('15017972-ba78-4270-ab23-b68aded2a402', '422d8921-79bc-4dd8-99ae-c7858471798a', 2, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-12 00:00:00', 'confirmed', 10, '2026-01-12 00:00:00', '2026-01-12 06:00:00', '2026-01-08 19:35:19.235', '2026-01-08 19:35:19.235');
INSERT INTO public.schedules VALUES ('15017972-ba78-4270-ab23-b68aded2a403', 'f470d774-c3d1-48eb-bc77-eb0159621190', 3, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-12 00:00:00', 'confirmed', 10, '2026-01-12 00:00:00', '2026-01-12 06:00:00', '2026-01-08 19:35:19.235', '2026-01-08 19:35:19.235');
INSERT INTO public.schedules VALUES ('15017972-ba78-4270-ab23-b68aded2a404', 'eb0d5ec2-cd89-4034-bfbf-c33717d8c9f4', 3, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-12 00:00:00', 'confirmed', 10, '2026-01-12 00:00:00', '2026-01-12 06:00:00', '2026-01-08 19:35:19.235', '2026-01-08 19:35:19.235');
INSERT INTO public.schedules VALUES ('15017972-ba78-4270-ab23-b68aded2a405', 'a392675f-8c93-41d2-bde3-e42141e76cef', 4, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-12 00:00:00', 'confirmed', 10, '2026-01-12 00:00:00', '2026-01-12 06:00:00', '2026-01-08 19:35:19.235', '2026-01-08 19:35:19.235');
INSERT INTO public.schedules VALUES ('15017972-ba78-4270-ab23-b68aded2a406', '2e335910-80af-443b-a1a3-3be509ae1b4d', 4, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-12 00:00:00', 'confirmed', 10, '2026-01-12 00:00:00', '2026-01-12 06:00:00', '2026-01-08 19:35:19.235', '2026-01-08 19:35:19.235');
INSERT INTO public.schedules VALUES ('15017972-ba78-4270-ab23-b68aded2a407', 'd7cb3ba8-4ac2-44e6-bfca-02b185a75730', 5, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-12 00:00:00', 'confirmed', 10, '2026-01-12 00:00:00', '2026-01-12 06:00:00', '2026-01-08 19:35:19.235', '2026-01-08 19:35:19.235');
INSERT INTO public.schedules VALUES ('15017972-ba78-4270-ab23-b68aded2a408', 'ecf73bd5-3066-48ec-bfa2-88dd85ad98cf', 5, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-12 00:00:00', 'confirmed', 10, '2026-01-12 00:00:00', '2026-01-12 06:00:00', '2026-01-08 19:35:19.235', '2026-01-08 19:35:19.235');
INSERT INTO public.schedules VALUES ('15017972-ba78-4270-ab23-b68aded2a409', '4ed76fa3-ae06-47ab-94f3-d531a180b952', 6, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-12 00:00:00', 'confirmed', 10, '2026-01-12 00:00:00', '2026-01-12 06:00:00', '2026-01-08 19:35:19.235', '2026-01-08 19:35:19.235');
INSERT INTO public.schedules VALUES ('15017972-ba78-4270-ab23-b68aded2a410', 'd736450a-deca-4f2d-9c22-8480849814ba', 6, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-12 00:00:00', 'confirmed', 10, '2026-01-12 00:00:00', '2026-01-12 06:00:00', '2026-01-08 19:35:19.235', '2026-01-08 19:35:19.235');
INSERT INTO public.schedules VALUES ('15017972-ba78-4270-ab23-b68aded2a411', 'e09c8604-abe4-48a3-83ea-895cbaeb24c9', 7, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-12 00:00:00', 'confirmed', 10, '2026-01-12 00:00:00', '2026-01-12 06:00:00', '2026-01-08 19:35:19.235', '2026-01-08 19:35:19.235');
INSERT INTO public.schedules VALUES ('15017972-ba78-4270-ab23-b68aded2a412', 'e55f2173-06f4-4fe1-ad97-ae963755ea33', 7, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-12 00:00:00', 'confirmed', 10, '2026-01-12 00:00:00', '2026-01-12 06:00:00', '2026-01-08 19:35:19.235', '2026-01-08 19:35:19.235');
INSERT INTO public.schedules VALUES ('c3e26ffd-0e70-4c60-8be0-c554bfb06885', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 1, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-12 00:00:00', 'confirmed', 10, '2026-01-12 00:00:00', '2026-01-12 06:00:00', '2026-01-09 05:18:12.198', '2026-01-09 05:18:12.198');
INSERT INTO public.schedules VALUES ('a63fb8c8-25d5-449d-8b3b-f0a7dc1c381f', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 1, 'appointment', 'f1679761-98bf-4bf4-a82f-73dc801470cb', '2026-01-09 00:00:00', 'confirmed', 10, '2026-01-09 00:00:00', '2026-01-09 06:00:00', '2026-01-03 04:19:30.027', '2026-01-03 04:19:30.027');


--
-- TOC entry 5427 (class 0 OID 23002)
-- Dependencies: 231
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5420 (class 0 OID 22960)
-- Dependencies: 224
-- Data for Name: staffs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.staffs VALUES ('3f3ab543-09d5-475b-8e57-366330d4f400', 'ADM001', 13, 'Quản lý', '2020-10-10 00:00:00', NULL);
INSERT INTO public.staffs VALUES ('1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'DOC002', 1, 'Bác sĩ', '2010-01-01 00:00:00', NULL);
INSERT INTO public.staffs VALUES ('698259b2-f399-45c1-b673-b2721cf0ea16', 'DOC003', 1, 'Bác sĩ', '2010-01-01 00:00:00', NULL);
INSERT INTO public.staffs VALUES ('61a78a93-ca60-4f23-921b-10ff69883f25', 'DOC004', 2, 'Bác sĩ', '2005-06-01 00:00:00', NULL);
INSERT INTO public.staffs VALUES ('422d8921-79bc-4dd8-99ae-c7858471798a', 'DOC005', 2, 'Bác sĩ', '2015-02-01 00:00:00', NULL);
INSERT INTO public.staffs VALUES ('f470d774-c3d1-48eb-bc77-eb0159621190', 'DOC006', 3, 'Bác sĩ', '2008-04-15 00:00:00', NULL);
INSERT INTO public.staffs VALUES ('eb0d5ec2-cd89-4034-bfbf-c33717d8c9f4', 'DOC007', 3, 'Bác sĩ', '2006-05-01 00:00:00', NULL);
INSERT INTO public.staffs VALUES ('a392675f-8c93-41d2-bde3-e42141e76cef', 'DOC008', 4, 'Bác sĩ', '1995-09-01 00:00:00', NULL);
INSERT INTO public.staffs VALUES ('2e335910-80af-443b-a1a3-3be509ae1b4d', 'DOC009', 4, 'Bác sĩ', '2010-07-01 00:00:00', NULL);
INSERT INTO public.staffs VALUES ('d7cb3ba8-4ac2-44e6-bfca-02b185a75730', 'DOC010', 5, 'Bác sĩ', '2012-03-10 00:00:00', NULL);
INSERT INTO public.staffs VALUES ('ecf73bd5-3066-48ec-bfa2-88dd85ad98cf', 'DOC011', 5, 'Bác sĩ', '2004-09-01 00:00:00', NULL);
INSERT INTO public.staffs VALUES ('4ed76fa3-ae06-47ab-94f3-d531a180b952', 'DOC012', 6, 'Bác sĩ', '2007-07-01 00:00:00', NULL);
INSERT INTO public.staffs VALUES ('d736450a-deca-4f2d-9c22-8480849814ba', 'DOC013', 6, 'Bác sĩ', '2016-01-15 00:00:00', NULL);
INSERT INTO public.staffs VALUES ('e09c8604-abe4-48a3-83ea-895cbaeb24c9', 'DOC014', 7, 'Bác sĩ', '2000-11-01 00:00:00', NULL);
INSERT INTO public.staffs VALUES ('e55f2173-06f4-4fe1-ad97-ae963755ea33', 'DOC015', 7, 'Bác sĩ', '2011-10-01 00:00:00', NULL);


--
-- TOC entry 5415 (class 0 OID 22915)
-- Dependencies: 219
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES ('57018bfc-c48e-4725-bd80-76f7158f9184', 'nguyenvanquang', 'nguyenvanquang@gmail.com', '$2a$10$7rJwWwzF7ZikyL2xAgLlIeWk9MpLUZdJcmJw7Xsp/YGNJq56uNYki', 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png', '2003-07-28 00:00:00', 'male', '2025-12-18 07:43:33.504', '2025-12-18 07:43:33.504', '0912336324', 'd4886a1a-d213-4b20-82c3-78b617dc9415', 1, NULL);
INSERT INTO public.users VALUES ('cf5f6586-3f10-4bdf-a9d5-525f76c69382', 'nguyenvana', 'nguyenvana@gmail.com', '$2a$10$vsUC8xRujt1tNv29lTpLn.ZKnFCYwyM.QjJFhdJ4hYWguo4FpS6A6', 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png', '2003-07-28 00:00:00', 'female', '2025-12-18 07:54:21.538', '2025-12-18 07:54:21.538', '0912336369', 'ff8913a1-0552-4484-9512-0ef6714c66e7', 1, NULL);
INSERT INTO public.users VALUES ('3f3ab543-09d5-475b-8e57-366330d4f400', 'nguyenminhtuan', 'nguyenminhtuanfullstack1@gmail.com', '$2a$10$0zAKx127KjdOq9Kn2IPRMOSDcK2yZTTl9TXygBHhGDkH1lwpiXHR6', 'https://res.cloudinary.com/dctzo9scu/image/upload/v1764271253/healthsystem/avatars/c8ad6bb0c6429c6ab76bed282e270b29.jpg', '2003-07-28 00:00:00', 'male', '2025-10-24 05:22:33.896', '2025-11-27 19:21:28.069', '0912336324', '9166b476-c808-47df-b4a7-514077569c73', 3, '027203001602');
INSERT INTO public.users VALUES ('698259b2-f399-45c1-b673-b2721cf0ea16', 'nguyenvankien', 'nguyenvankien@gmail.com', '$2a$10$0zAKx127KjdOq9Kn2IPRMOSDcK2yZTTl9TXygBHhGDkH1lwpiXHR6', 'https://hthaostudio.com/wp-content/uploads/2022/08/Anh-profile-bac-si-min.jpg', '1960-01-01 00:00:00', 'male', '2025-10-24 08:37:56.706', '2026-01-08 15:45:51.644', '0912345678', 'c2073812-a576-43fe-b0e5-3207178e2504', 2, '027203001604');
INSERT INTO public.users VALUES ('e29c3065-9964-4767-9d25-dc0173fe8978', 'nguyenminhtuanit03', 'nguyenminhtuan28072003@gmail.com', '$2a$10$wH8xHmY58dBKctoLCIFZouT9pgZsKSEfPGXYsKFAwH6Nz5Tr4TCvq', 'https://res.cloudinary.com/dctzo9scu/image/upload/v1764270490/healthsystem/avatars/6214c70ae7af20e68f5d61114ff94566.jpg', '2003-07-28 00:00:00', 'male', '2025-10-23 16:18:28.551', '2026-01-01 14:12:45.095', '0912336324', 'f8aaca16-1571-4ec2-9949-d8fe840c6f31', 1, '027203001682');
INSERT INTO public.users VALUES ('1a9a6186-1036-44ae-bf1e-0db7304f9b8c', 'hoangvantrung1', 'hoangvantrung@gmail.com', '$2a$10$0zAKx127KjdOq9Kn2IPRMOSDcK2yZTTl9TXygBHhGDkH1lwpiXHR6', 'https://hthaostudio.com/wp-content/uploads/2022/03/Anh-bac-si-nam-7-min.jpg.webp', '1960-01-01 00:00:00', 'male', '2025-10-24 08:37:56.679', '2026-01-08 15:45:51.629', '0912345678', '0f8381d2-02b6-4567-8806-c3f58749fc85', 2, '027203001603');
INSERT INTO public.users VALUES ('61a78a93-ca60-4f23-921b-10ff69883f25', 'tranmai', 'tranmai@gmail.com', '$2a$10$0zAKx127KjdOq9Kn2IPRMOSDcK2yZTTl9TXygBHhGDkH1lwpiXHR6', 'https://htmediagroup.vn/wp-content/uploads/2022/12/Anh-bac-si-12-min.jpg.webp', '1975-03-15 00:00:00', 'female', '2025-10-24 08:37:56.713', '2026-01-08 15:45:51.645', '0987654321', 'd08313c1-796b-4791-9364-3325e610dce2', 2, '027203001605');
INSERT INTO public.users VALUES ('422d8921-79bc-4dd8-99ae-c7858471798a', 'lethihong', 'lethihong@gmail.com', '$2a$10$0zAKx127KjdOq9Kn2IPRMOSDcK2yZTTl9TXygBHhGDkH1lwpiXHR6', 'https://htmediagroup.vn/wp-content/uploads/2023/03/Anh-bac-si-nam-4-min.jpg', '1985-06-22 00:00:00', 'female', '2025-10-24 08:37:56.719', '2026-01-08 15:45:51.646', '0934567890', '330cd0a8-9631-48e7-8d39-223ae8edfb92', 2, '027203001606');
INSERT INTO public.users VALUES ('f470d774-c3d1-48eb-bc77-eb0159621190', 'phamnhung', 'phamnhung@gmail.com', '$2a$10$0zAKx127KjdOq9Kn2IPRMOSDcK2yZTTl9TXygBHhGDkH1lwpiXHR6', 'https://bizweb.dktcdn.net/100/175/849/files/chup-anh-profile-cho-bac-si-tai-ha-noi-studio-yeu-media-dep-01.jpg?v=1636203347577', '1980-07-20 00:00:00', 'female', '2025-10-24 08:37:56.726', '2026-01-08 15:45:51.648', '0901234567', '6642cf3c-d924-47d7-8e98-79d88469a09c', 2, '027203001607');
INSERT INTO public.users VALUES ('eb0d5ec2-cd89-4034-bfbf-c33717d8c9f4', 'nguyenlan', 'nguyenlan@gmail.com', '$2a$10$0zAKx127KjdOq9Kn2IPRMOSDcK2yZTTl9TXygBHhGDkH1lwpiXHR6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUayQski0jeAk4NjVl1rLv6GaoVvfFmdErow&s', '1978-09-10 00:00:00', 'female', '2025-10-24 08:37:56.731', '2026-01-08 15:45:51.649', '0941234567', '98a5bcbd-1521-4ae7-bd69-0e69382cbb39', 2, '027203001608');
INSERT INTO public.users VALUES ('a392675f-8c93-41d2-bde3-e42141e76cef', 'levanhung', 'levanhung@gmail.com', '$2a$10$0zAKx127KjdOq9Kn2IPRMOSDcK2yZTTl9TXygBHhGDkH1lwpiXHR6', 'https://htmediagroup.vn/wp-content/uploads/2022/09/Anh-bac-si-nu-1-min.jpg.webp', '1965-11-10 00:00:00', 'male', '2025-10-24 08:37:56.737', '2026-01-08 15:45:51.65', '0918765432', '9083f45a-d91c-48d9-91ba-b25290d6c817', 2, '027203001609');
INSERT INTO public.users VALUES ('2e335910-80af-443b-a1a3-3be509ae1b4d', 'tranquocanh', 'tranquocanh@gmail.com', '$2a$10$0zAKx127KjdOq9Kn2IPRMOSDcK2yZTTl9TXygBHhGDkH1lwpiXHR6', 'https://htmediagroup.vn/wp-content/uploads/2022/03/Anh-ba-si-12.jpg', '1983-01-15 00:00:00', 'male', '2025-10-24 08:37:56.743', '2026-01-08 15:45:51.652', '0967890123', 'c8db4baa-12c9-4826-8d13-7f2ed4f9d372', 2, '027203001610');
INSERT INTO public.users VALUES ('d7cb3ba8-4ac2-44e6-bfca-02b185a75730', 'dothilan', 'dothilan@gmail.com', '$2a$10$0zAKx127KjdOq9Kn2IPRMOSDcK2yZTTl9TXygBHhGDkH1lwpiXHR6', 'https://bizweb.dktcdn.net/100/175/849/files/z4277782293907-c8f4b060c69fabc0f3da6e6d44e4e8ab.jpg?v=1681895251208', '1982-02-25 00:00:00', 'female', '2025-10-24 08:37:56.749', '2026-01-08 15:45:51.653', '0932145678', '8a5a92b5-a4d2-4f20-b3fb-84ed52e8b882', 2, '027203001611');
INSERT INTO public.users VALUES ('ecf73bd5-3066-48ec-bfa2-88dd85ad98cf', 'phamvandung', 'phamvandung@gmail.com', '$2a$10$0zAKx127KjdOq9Kn2IPRMOSDcK2yZTTl9TXygBHhGDkH1lwpiXHR6', 'https://hthaostudio.com/wp-content/uploads/2019/08/Anh-Doanh-nhan-49.jpg', '1976-12-05 00:00:00', 'male', '2025-10-24 08:37:56.756', '2026-01-08 15:45:51.654', '0956789012', '2209bc18-dc33-43c2-b584-3c379bdf9888', 2, '027203001612');
INSERT INTO public.users VALUES ('4ed76fa3-ae06-47ab-94f3-d531a180b952', 'hoangvannam', 'hoangvannam@gmail.com', '$2a$10$0zAKx127KjdOq9Kn2IPRMOSDcK2yZTTl9TXygBHhGDkH1lwpiXHR6', 'https://htmediagroup.vn/wp-content/uploads/2022/01/Anh-bac-si-1-min.jpg.webp', '1978-05-12 00:00:00', 'male', '2025-10-24 08:37:56.761', '2026-01-08 15:45:51.655', '0971234567', '5fb7ce1a-6b39-48a9-9d77-297d758f7eeb', 2, '027203001613');
INSERT INTO public.users VALUES ('d736450a-deca-4f2d-9c22-8480849814ba', 'nguyenthu', 'nguyenthu@gmail.com', '$2a$10$0zAKx127KjdOq9Kn2IPRMOSDcK2yZTTl9TXygBHhGDkH1lwpiXHR6', 'https://htmediagroup.vn/wp-content/uploads/2021/07/anh-profile-bac-si-1-585x878.jpg.webp', '1988-03-25 00:00:00', 'female', '2025-10-24 08:37:56.766', '2026-01-08 15:45:51.656', '0989012345', 'a4a86d4a-fcd2-4fca-b212-72ff908b47a7', 2, '027203001614');
INSERT INTO public.users VALUES ('e09c8604-abe4-48a3-83ea-895cbaeb24c9', 'vuhong', 'vuhong@gmail.com', '$2a$10$0zAKx127KjdOq9Kn2IPRMOSDcK2yZTTl9TXygBHhGDkH1lwpiXHR6', 'https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/12/25/1-17035025379211648167770.png', '1970-09-30 00:00:00', 'female', '2025-10-24 08:37:56.772', '2026-01-08 15:45:51.657', '0945678901', 'ddadef5a-b54e-4cd5-82e8-916a71005c65', 2, '027203001615');
INSERT INTO public.users VALUES ('e55f2173-06f4-4fe1-ad97-ae963755ea33', 'dangvanlong', 'dangvanlong@gmail.com', '$2a$10$0zAKx127KjdOq9Kn2IPRMOSDcK2yZTTl9TXygBHhGDkH1lwpiXHR6', 'https://img.pikbest.com/origin/10/06/86/46KpIkbEsThtM.png!w700wp', '1981-08-14 00:00:00', 'male', '2025-10-24 08:37:56.777', '2026-01-08 15:45:51.657', '0913456789', 'e774a756-1da8-483e-82c6-f493daf178fb', 2, '027203001616');
INSERT INTO public.users VALUES ('4de0fd7f-1696-4945-9549-22ae13666300', 'patient000', 'patient@gmail.com', '$2a$10$0zAKx127KjdOq9Kn2IPRMOSDcK2yZTTl9TXygBHhGDkH1lwpiXHR6', 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png', '2002-07-28 00:00:00', 'female', '2025-10-23 16:18:28.588', '2025-10-23 16:18:28.588', '0912336345', 'c0a99273-fd47-4925-8d0a-74c2bd4ba252', 1, '027203001601');
INSERT INTO public.users VALUES ('06f472db-0bfd-4a08-b23f-e44f2bc14330', 'minhtuan', 'nguyenminhtuanfullstack2@gmail.com', '$2a$10$k2mribyE1CfD8oc6j5I82.lM8UzJqgo0ZC0q7muPknPBDg5D6T.4.', 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png', '2003-07-27 17:00:00', 'male', '2025-11-01 07:57:32.534', '2025-11-01 07:57:32.534', '0912336324', '3405b622-6f20-4b28-946a-ae74b48e4940', 1, NULL);
INSERT INTO public.users VALUES ('23078f0b-a5e9-4c90-84d4-e0738552033a', 'accounttest', 'nguyenminhtuanfullstack@gmail.com', '$2a$10$FIjI2XU8ZvxqDlK/tFTRjOlfBhIsrW.CJJFxWWIKlFWi6NlgC5Jy2', 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png', '2003-07-27 17:00:00', 'male', '2025-12-30 05:59:44.191', '2025-12-30 05:59:44.191', '0912336324', '5f42b110-f10c-4db3-81a7-ed07247ccc3d', 1, NULL);


--
-- TOC entry 5417 (class 0 OID 22934)
-- Dependencies: 221
-- Data for Name: verification_codes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.verification_codes VALUES ('52a79f0d-0082-45cd-b560-0b3b8ac0ab73', '57018bfc-c48e-4725-bd80-76f7158f9184', 'nguyenvanquang@gmail.com', '$2a$10$Vkxk/UptA/T5AVirRSNRDOw32xeTFeVBSb3EioBtZgQ3kBl7aT1l2', 'REGISTER', 0, '2025-12-18 07:43:33.603', 'EMAIL', '2025-12-18 07:48:33.603', false, '2025-12-18 07:43:33.604');
INSERT INTO public.verification_codes VALUES ('416c3e0d-e1fe-4c07-8a30-62a2d2e18bec', 'cf5f6586-3f10-4bdf-a9d5-525f76c69382', 'nguyenvana@gmail.com', '$2a$10$IklKRLMANQjfFilL0wU.kOwKl84TCuQ454M.8//JpcgqzfkPmh.Uy', 'REGISTER', 0, '2025-12-18 07:54:21.629', 'EMAIL', '2025-12-18 07:59:21.629', false, '2025-12-18 07:54:21.63');


--
-- TOC entry 5453 (class 0 OID 36719)
-- Dependencies: 257
-- Data for Name: visit_services; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.visit_services VALUES ('5c2cc3f5-d0b2-478e-a91f-55dd109fe3bb', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed35', '550e8400-e29b-41d4-a716-446655440001', 1, 200000, 'done', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '2025-12-30 13:26:55.785', '2025-12-30 13:26:55.785', '2026-01-09 04:37:01.895', true);
INSERT INTO public.visit_services VALUES ('72592fe8-c055-4afc-85d9-f83f2bb0433c', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed37', '550e8400-e29b-41d4-a716-446655440013', 1, 500000, 'ordered', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '2026-01-06 21:47:55.365', '2026-01-06 21:47:55.365', '2026-01-09 04:37:01.895', true);
INSERT INTO public.visit_services VALUES ('2ce3a07d-84c2-4f28-8f53-5246b73655ca', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed37', '550e8400-e29b-41d4-a716-446655440007', 1, 250000, 'ordered', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '2026-01-06 21:52:28.309', '2026-01-06 21:52:28.309', '2026-01-09 04:37:01.895', true);
INSERT INTO public.visit_services VALUES ('5998673e-2785-418b-8816-5fa4ed556d43', 'e3edd5f3-7c7b-4abe-92ca-c5d77539ed37', '550e8400-e29b-41d4-a716-446655440003', 1, 150000, 'ordered', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '2026-01-06 21:54:56.976', '2026-01-06 21:54:56.976', '2026-01-09 04:37:01.895', true);
INSERT INTO public.visit_services VALUES ('d2f57f80-2dfd-4342-8fdd-1e7b792a17a9', '17bb807b-f333-4d0c-b827-3e0a399746c4', '550e8400-e29b-41d4-a716-446655440013', 1, 500000, 'ordered', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '2026-01-08 05:20:47.084', '2026-01-08 05:20:47.084', '2026-01-09 04:37:01.895', true);
INSERT INTO public.visit_services VALUES ('d9a1c064-f0ce-4e08-b86e-b61908997f6b', '17bb807b-f333-4d0c-b827-3e0a399746c4', '550e8400-e29b-41d4-a716-446655440003', 1, 150000, 'ordered', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '2026-01-08 05:20:47.09', '2026-01-08 05:20:47.09', '2026-01-09 04:37:01.895', true);
INSERT INTO public.visit_services VALUES ('f5508a82-e197-4230-81bd-d50eae0b694d', '75f7dc79-1d17-4b9f-8d3f-41ff03fa82fc', '550e8400-e29b-41d4-a716-446655440008', 1, 200000, 'ordered', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '2026-01-08 06:35:04.459', '2026-01-08 06:35:04.459', '2026-01-09 04:37:01.895', true);
INSERT INTO public.visit_services VALUES ('a36bce6f-0176-4747-b17d-ef409ac89471', '40e91844-2ff7-4c02-8109-d3ec05992de0', '550e8400-e29b-41d4-a716-446655440001', 1, 200000, 'done', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '2026-01-09 05:29:42.475', '2026-01-09 05:29:42.475', '2026-01-09 05:38:51.702', false);


--
-- TOC entry 5452 (class 0 OID 36710)
-- Dependencies: 256
-- Data for Name: visits; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.visits VALUES ('e3edd5f3-7c7b-4abe-92ca-c5d77539ed35', '8bf4f864-5202-4532-83b7-4058b048bec4', 'd0416d3f-48a4-4188-b417-28bdd54ac620', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '550e8400-e29b-41d4-a716-446655440001', 'completed', '2025-12-30 05:11:54.202', '2025-12-30 06:11:54.202', '2025-12-30 13:17:47.529', '2025-12-30 13:17:14.34', '2026-01-01 17:56:08.946', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new');
INSERT INTO public.visits VALUES ('44efb8f0-9a1e-45dd-96af-dfa1895d9ce1', NULL, 'd7261945-0d63-4260-9b7a-4ab721a82e96', NULL, '550e8400-e29b-41d4-a716-446655440012', 'completed', '2025-12-30 13:05:00', NULL, '2025-12-30 13:08:23.121', '2025-12-30 13:08:23.121', NULL, '57018bfc-c48e-4725-bd80-76f7158f9184', 'new');
INSERT INTO public.visits VALUES ('e3edd5f3-7c7b-4abe-92ca-c5d77539ed37', NULL, 'd0416d3f-48a4-4188-b417-28bdd54ac620', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '550e8400-e29b-41d4-a716-446655440001', 'completed', '2026-01-01 05:11:54.202', NULL, '2025-01-01 05:17:47.529', '2026-01-06 22:41:49.855', NULL, 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new');
INSERT INTO public.visits VALUES ('75f7dc79-1d17-4b9f-8d3f-41ff03fa82fc', NULL, 'd0416d3f-48a4-4188-b417-28bdd54ac620', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '550e8400-e29b-41d4-a716-446655440001', 'completed', '2026-01-08 05:00:00', NULL, '2026-01-08 06:33:24.449', '2026-01-08 21:25:58.973', NULL, 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new');
INSERT INTO public.visits VALUES ('17bb807b-f333-4d0c-b827-3e0a399746c4', NULL, 'd0416d3f-48a4-4188-b417-28bdd54ac620', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '550e8400-e29b-41d4-a716-446655440001', 'completed', '2026-01-08 05:00:00', NULL, '2026-01-08 05:18:08.289', '2026-01-08 21:33:28.725', NULL, 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new');
INSERT INTO public.visits VALUES ('40e91844-2ff7-4c02-8109-d3ec05992de0', NULL, 'd0416d3f-48a4-4188-b417-28bdd54ac620', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '550e8400-e29b-41d4-a716-446655440001', 'completed', '2026-01-09 05:30:00', NULL, '2026-01-09 05:26:33.243', '2026-01-09 05:36:50.008', '2026-01-16 00:00:48.502', 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new');
INSERT INTO public.visits VALUES ('dbf702f3-c664-472a-8270-bf0a3c78ad3b', NULL, 'd0416d3f-48a4-4188-b417-28bdd54ac620', '1a9a6186-1036-44ae-bf1e-0db7304f9b8c', '550e8400-e29b-41d4-a716-446655440001', 'in_progress', '2026-01-12 03:00:00', NULL, '2026-01-09 07:20:59.749', '2026-01-09 07:21:20.806', NULL, 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new');
INSERT INTO public.visits VALUES ('94096f8d-9f80-404a-b258-c6f691e60d32', NULL, 'd0416d3f-48a4-4188-b417-28bdd54ac620', '2e335910-80af-443b-a1a3-3be509ae1b4d', '550e8400-e29b-41d4-a716-446655440008', 'waiting', '2026-01-12 00:00:00', NULL, '2026-01-09 08:52:31.682', '2026-01-09 08:52:31.682', NULL, 'e29c3065-9964-4767-9d25-dc0173fe8978', 'new');


--
-- TOC entry 5467 (class 0 OID 0)
-- Dependencies: 229
-- Name: department_deputies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.department_deputies_id_seq', 7, true);


--
-- TOC entry 5468 (class 0 OID 0)
-- Dependencies: 227
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.departments_id_seq', 14, true);


--
-- TOC entry 5469 (class 0 OID 0)
-- Dependencies: 217
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_seq', 5, true);


--
-- TOC entry 5036 (class 2606 OID 22959)
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- TOC entry 5083 (class 2606 OID 23060)
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- TOC entry 5025 (class 2606 OID 22933)
-- Name: authentications authentications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentications
    ADD CONSTRAINT authentications_pkey PRIMARY KEY (user_id);


--
-- TOC entry 5093 (class 2606 OID 23076)
-- Name: buildings buildings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buildings
    ADD CONSTRAINT buildings_pkey PRIMARY KEY (id);


--
-- TOC entry 5148 (class 2606 OID 23198)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 5176 (class 2606 OID 23245)
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- TOC entry 5162 (class 2606 OID 23217)
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- TOC entry 5144 (class 2606 OID 23190)
-- Name: counters counters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_pkey PRIMARY KEY (id);


--
-- TOC entry 5059 (class 2606 OID 23001)
-- Name: department_deputies department_deputies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_deputies
    ADD CONSTRAINT department_deputies_pkey PRIMARY KEY (id);


--
-- TOC entry 5053 (class 2606 OID 22990)
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- TOC entry 5116 (class 2606 OID 23124)
-- Name: doctor_services doctor_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor_services
    ADD CONSTRAINT doctor_services_pkey PRIMARY KEY (doctor_id, medical_service_id);


--
-- TOC entry 5045 (class 2606 OID 22973)
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (user_id);


--
-- TOC entry 5076 (class 2606 OID 23034)
-- Name: ehrs ehrs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ehrs
    ADD CONSTRAINT ehrs_pkey PRIMARY KEY (id);


--
-- TOC entry 5179 (class 2606 OID 27979)
-- Name: emergency_contacts emergency_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emergency_contacts
    ADD CONSTRAINT emergency_contacts_pkey PRIMARY KEY (id);


--
-- TOC entry 5201 (class 2606 OID 36746)
-- Name: file_assets file_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.file_assets
    ADD CONSTRAINT file_assets_pkey PRIMARY KEY (id);


--
-- TOC entry 5156 (class 2606 OID 23209)
-- Name: health_articles health_articles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.health_articles
    ADD CONSTRAINT health_articles_pkey PRIMARY KEY (id);


--
-- TOC entry 5107 (class 2606 OID 23106)
-- Name: health_informations health_informations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.health_informations
    ADD CONSTRAINT health_informations_pkey PRIMARY KEY (id);


--
-- TOC entry 5071 (class 2606 OID 23025)
-- Name: health_insurances health_insurances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.health_insurances
    ADD CONSTRAINT health_insurances_pkey PRIMARY KEY (id);


--
-- TOC entry 5090 (class 2606 OID 23068)
-- Name: hospitals hospitals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT hospitals_pkey PRIMARY KEY (id);


--
-- TOC entry 5204 (class 2606 OID 36755)
-- Name: invoice_items invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5121 (class 2606 OID 23144)
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- TOC entry 5048 (class 2606 OID 22980)
-- Name: managers managers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.managers
    ADD CONSTRAINT managers_pkey PRIMARY KEY (user_id);


--
-- TOC entry 5197 (class 2606 OID 36737)
-- Name: medical_records medical_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_records
    ADD CONSTRAINT medical_records_pkey PRIMARY KEY (id);


--
-- TOC entry 5112 (class 2606 OID 23116)
-- Name: medical_services medical_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_services
    ADD CONSTRAINT medical_services_pkey PRIMARY KEY (id);


--
-- TOC entry 5141 (class 2606 OID 23182)
-- Name: medicine_usages medicine_usages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicine_usages
    ADD CONSTRAINT medicine_usages_pkey PRIMARY KEY (id);


--
-- TOC entry 5133 (class 2606 OID 23164)
-- Name: medicines medicines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_pkey PRIMARY KEY (id);


--
-- TOC entry 5167 (class 2606 OID 23226)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 5034 (class 2606 OID 22951)
-- Name: names names_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.names
    ADD CONSTRAINT names_pkey PRIMARY KEY (user_id);


--
-- TOC entry 5171 (class 2606 OID 23236)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 5067 (class 2606 OID 23016)
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (user_id);


--
-- TOC entry 5127 (class 2606 OID 23155)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 5137 (class 2606 OID 23173)
-- Name: prescriptions prescriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_pkey PRIMARY KEY (id);


--
-- TOC entry 5011 (class 2606 OID 22914)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 5097 (class 2606 OID 23084)
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- TOC entry 5101 (class 2606 OID 23094)
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
-- TOC entry 5063 (class 2606 OID 23009)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 5039 (class 2606 OID 22966)
-- Name: staffs staffs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staffs
    ADD CONSTRAINT staffs_pkey PRIMARY KEY (user_id);


--
-- TOC entry 5017 (class 2606 OID 22924)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5030 (class 2606 OID 22944)
-- Name: verification_codes verification_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_codes
    ADD CONSTRAINT verification_codes_pkey PRIMARY KEY (id);


--
-- TOC entry 5192 (class 2606 OID 36729)
-- Name: visit_services visit_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visit_services
    ADD CONSTRAINT visit_services_pkey PRIMARY KEY (id);


--
-- TOC entry 5186 (class 2606 OID 36718)
-- Name: visits visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_pkey PRIMARY KEY (id);


--
-- TOC entry 5077 (class 1259 OID 23606)
-- Name: appointments_booked_by_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX appointments_booked_by_user_id_idx ON public.appointments USING btree (booked_by_user_id);


--
-- TOC entry 5078 (class 1259 OID 23299)
-- Name: appointments_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX appointments_created_at_idx ON public.appointments USING btree (created_at);


--
-- TOC entry 5079 (class 1259 OID 23296)
-- Name: appointments_doctor_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX appointments_doctor_id_idx ON public.appointments USING btree (doctor_id);


--
-- TOC entry 5080 (class 1259 OID 28975)
-- Name: appointments_medical_service_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX appointments_medical_service_id_idx ON public.appointments USING btree (medical_service_id);


--
-- TOC entry 5081 (class 1259 OID 23295)
-- Name: appointments_patient_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX appointments_patient_id_idx ON public.appointments USING btree (patient_id);


--
-- TOC entry 5084 (class 1259 OID 25486)
-- Name: appointments_schedule_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX appointments_schedule_id_idx ON public.appointments USING btree (schedule_id);


--
-- TOC entry 5085 (class 1259 OID 23298)
-- Name: appointments_start_time_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX appointments_start_time_idx ON public.appointments USING btree (start_time);


--
-- TOC entry 5086 (class 1259 OID 23297)
-- Name: appointments_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX appointments_status_idx ON public.appointments USING btree (status);


--
-- TOC entry 5020 (class 1259 OID 23255)
-- Name: authentications_facebook_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX authentications_facebook_id_key ON public.authentications USING btree (facebook_id);


--
-- TOC entry 5021 (class 1259 OID 23254)
-- Name: authentications_google_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX authentications_google_id_key ON public.authentications USING btree (google_id);


--
-- TOC entry 5022 (class 1259 OID 23256)
-- Name: authentications_is_verified_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authentications_is_verified_idx ON public.authentications USING btree (is_verified);


--
-- TOC entry 5023 (class 1259 OID 23257)
-- Name: authentications_last_login_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authentications_last_login_idx ON public.authentications USING btree (last_login);


--
-- TOC entry 5091 (class 1259 OID 23302)
-- Name: buildings_hospital_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX buildings_hospital_id_idx ON public.buildings USING btree (hospital_id);


--
-- TOC entry 5145 (class 1259 OID 23330)
-- Name: categories_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX categories_name_key ON public.categories USING btree (name);


--
-- TOC entry 5146 (class 1259 OID 23332)
-- Name: categories_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX categories_parent_id_idx ON public.categories USING btree (parent_id);


--
-- TOC entry 5149 (class 1259 OID 23331)
-- Name: categories_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug);


--
-- TOC entry 5174 (class 1259 OID 23346)
-- Name: contacts_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX contacts_created_at_idx ON public.contacts USING btree (created_at);


--
-- TOC entry 5160 (class 1259 OID 23340)
-- Name: conversations_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX conversations_created_at_idx ON public.conversations USING btree (created_at);


--
-- TOC entry 5163 (class 1259 OID 23339)
-- Name: conversations_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX conversations_user_id_idx ON public.conversations USING btree (user_id);


--
-- TOC entry 5056 (class 1259 OID 23277)
-- Name: department_deputies_department_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX department_deputies_department_id_idx ON public.department_deputies USING btree (department_id);


--
-- TOC entry 5057 (class 1259 OID 23278)
-- Name: department_deputies_department_id_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "department_deputies_department_id_userId_key" ON public.department_deputies USING btree (department_id, "userId");


--
-- TOC entry 5060 (class 1259 OID 23276)
-- Name: department_deputies_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "department_deputies_userId_key" ON public.department_deputies USING btree ("userId");


--
-- TOC entry 5049 (class 1259 OID 23271)
-- Name: departments_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX departments_code_key ON public.departments USING btree (code);


--
-- TOC entry 5050 (class 1259 OID 23272)
-- Name: departments_head_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX departments_head_id_key ON public.departments USING btree (head_id);


--
-- TOC entry 5051 (class 1259 OID 23270)
-- Name: departments_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX departments_name_key ON public.departments USING btree (name);


--
-- TOC entry 5054 (class 1259 OID 23273)
-- Name: departments_room_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX departments_room_id_key ON public.departments USING btree (room_id);


--
-- TOC entry 5055 (class 1259 OID 23274)
-- Name: departments_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX departments_type_idx ON public.departments USING btree (type);


--
-- TOC entry 5114 (class 1259 OID 23314)
-- Name: doctor_services_medical_service_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX doctor_services_medical_service_id_idx ON public.doctor_services USING btree (medical_service_id);


--
-- TOC entry 5042 (class 1259 OID 23269)
-- Name: doctors_level_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX doctors_level_idx ON public.doctors USING btree (level);


--
-- TOC entry 5043 (class 1259 OID 23267)
-- Name: doctors_license_number_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX doctors_license_number_key ON public.doctors USING btree (license_number);


--
-- TOC entry 5046 (class 1259 OID 23268)
-- Name: doctors_specialization_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX doctors_specialization_idx ON public.doctors USING btree (specialization);


--
-- TOC entry 5073 (class 1259 OID 23607)
-- Name: ehrs_patient_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ehrs_patient_id_idx ON public.ehrs USING btree (patient_id);


--
-- TOC entry 5074 (class 1259 OID 23287)
-- Name: ehrs_patient_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ehrs_patient_id_key ON public.ehrs USING btree (patient_id);


--
-- TOC entry 5177 (class 1259 OID 27980)
-- Name: emergency_contacts_patient_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX emergency_contacts_patient_id_idx ON public.emergency_contacts USING btree (patient_id);


--
-- TOC entry 5199 (class 1259 OID 36768)
-- Name: file_assets_entity_type_entity_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX file_assets_entity_type_entity_id_idx ON public.file_assets USING btree (entity_type, entity_id);


--
-- TOC entry 5150 (class 1259 OID 36770)
-- Name: health_articles_assignee_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX health_articles_assignee_id_idx ON public.health_articles USING btree (assignee_id);


--
-- TOC entry 5151 (class 1259 OID 23334)
-- Name: health_articles_author_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX health_articles_author_id_idx ON public.health_articles USING btree (author_id);


--
-- TOC entry 5152 (class 1259 OID 23335)
-- Name: health_articles_category_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX health_articles_category_id_idx ON public.health_articles USING btree (category_id);


--
-- TOC entry 5153 (class 1259 OID 23608)
-- Name: health_articles_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX health_articles_created_at_idx ON public.health_articles USING btree (created_at);


--
-- TOC entry 5154 (class 1259 OID 23337)
-- Name: health_articles_featured_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX health_articles_featured_idx ON public.health_articles USING btree (featured);


--
-- TOC entry 5157 (class 1259 OID 23338)
-- Name: health_articles_published_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX health_articles_published_at_idx ON public.health_articles USING btree (published_at);


--
-- TOC entry 5158 (class 1259 OID 23333)
-- Name: health_articles_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX health_articles_slug_key ON public.health_articles USING btree (slug);


--
-- TOC entry 5159 (class 1259 OID 23336)
-- Name: health_articles_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX health_articles_status_idx ON public.health_articles USING btree (status);


--
-- TOC entry 5105 (class 1259 OID 23310)
-- Name: health_informations_patient_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX health_informations_patient_id_key ON public.health_informations USING btree (patient_id);


--
-- TOC entry 5068 (class 1259 OID 23286)
-- Name: health_insurances_end_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX health_insurances_end_at_idx ON public.health_insurances USING btree (end_at);


--
-- TOC entry 5069 (class 1259 OID 23283)
-- Name: health_insurances_insurance_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX health_insurances_insurance_id_key ON public.health_insurances USING btree (insurance_id);


--
-- TOC entry 5072 (class 1259 OID 23284)
-- Name: health_insurances_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX health_insurances_user_id_idx ON public.health_insurances USING btree (user_id);


--
-- TOC entry 5087 (class 1259 OID 23300)
-- Name: hospitals_address_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX hospitals_address_id_key ON public.hospitals USING btree (address_id);


--
-- TOC entry 5088 (class 1259 OID 23301)
-- Name: hospitals_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX hospitals_name_idx ON public.hospitals USING btree (name);


--
-- TOC entry 5202 (class 1259 OID 36769)
-- Name: invoice_items_invoice_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX invoice_items_invoice_id_idx ON public.invoice_items USING btree (invoice_id);


--
-- TOC entry 5117 (class 1259 OID 23320)
-- Name: invoices_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "invoices_createdAt_idx" ON public.invoices USING btree ("createdAt");


--
-- TOC entry 5118 (class 1259 OID 28920)
-- Name: invoices_health_insurance_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX invoices_health_insurance_id_idx ON public.invoices USING btree (health_insurance_id);


--
-- TOC entry 5119 (class 1259 OID 23318)
-- Name: invoices_patient_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX invoices_patient_id_idx ON public.invoices USING btree (patient_id);


--
-- TOC entry 5122 (class 1259 OID 28953)
-- Name: invoices_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX invoices_status_idx ON public.invoices USING btree (status);


--
-- TOC entry 5194 (class 1259 OID 36767)
-- Name: medical_records_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX medical_records_created_at_idx ON public.medical_records USING btree (created_at);


--
-- TOC entry 5195 (class 1259 OID 36765)
-- Name: medical_records_doctor_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX medical_records_doctor_id_idx ON public.medical_records USING btree (doctor_id);


--
-- TOC entry 5198 (class 1259 OID 36766)
-- Name: medical_records_visitId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "medical_records_visitId_idx" ON public.medical_records USING btree ("visitId");


--
-- TOC entry 5108 (class 1259 OID 23311)
-- Name: medical_services_department_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX medical_services_department_id_idx ON public.medical_services USING btree (department_id);


--
-- TOC entry 5109 (class 1259 OID 23312)
-- Name: medical_services_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX medical_services_is_active_idx ON public.medical_services USING btree (is_active);


--
-- TOC entry 5110 (class 1259 OID 23313)
-- Name: medical_services_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX medical_services_name_idx ON public.medical_services USING btree (name);


--
-- TOC entry 5113 (class 1259 OID 23609)
-- Name: medical_services_room_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX medical_services_room_id_idx ON public.medical_services USING btree (room_id);


--
-- TOC entry 5139 (class 1259 OID 23329)
-- Name: medicine_usages_medicine_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX medicine_usages_medicine_id_idx ON public.medicine_usages USING btree (medicine_id);


--
-- TOC entry 5142 (class 1259 OID 23328)
-- Name: medicine_usages_prescription_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX medicine_usages_prescription_id_idx ON public.medicine_usages USING btree (prescription_id);


--
-- TOC entry 5129 (class 1259 OID 23604)
-- Name: medicines_category_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX medicines_category_idx ON public.medicines USING btree (category);


--
-- TOC entry 5130 (class 1259 OID 23605)
-- Name: medicines_manufacturer_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX medicines_manufacturer_idx ON public.medicines USING btree (manufacturer);


--
-- TOC entry 5131 (class 1259 OID 23603)
-- Name: medicines_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX medicines_name_idx ON public.medicines USING btree (name);


--
-- TOC entry 5164 (class 1259 OID 23341)
-- Name: messages_conversation_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX messages_conversation_id_idx ON public.messages USING btree (conversation_id);


--
-- TOC entry 5165 (class 1259 OID 23342)
-- Name: messages_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX messages_created_at_idx ON public.messages USING btree (created_at);


--
-- TOC entry 5168 (class 1259 OID 23343)
-- Name: messages_sender_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX messages_sender_idx ON public.messages USING btree (sender);


--
-- TOC entry 5169 (class 1259 OID 23345)
-- Name: notifications_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notifications_created_at_idx ON public.notifications USING btree (created_at);


--
-- TOC entry 5172 (class 1259 OID 28985)
-- Name: notifications_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notifications_type_idx ON public.notifications USING btree (type);


--
-- TOC entry 5173 (class 1259 OID 23344)
-- Name: notifications_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notifications_user_id_idx ON public.notifications USING btree (user_id);


--
-- TOC entry 5065 (class 1259 OID 23281)
-- Name: patients_patient_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX patients_patient_id_key ON public.patients USING btree (patient_id);


--
-- TOC entry 5123 (class 1259 OID 23324)
-- Name: payments_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "payments_createdAt_idx" ON public.payments USING btree ("createdAt");


--
-- TOC entry 5124 (class 1259 OID 23321)
-- Name: payments_invoice_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX payments_invoice_id_key ON public.payments USING btree (invoice_id);


--
-- TOC entry 5125 (class 1259 OID 23323)
-- Name: payments_payment_method_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payments_payment_method_idx ON public.payments USING btree (payment_method);


--
-- TOC entry 5128 (class 1259 OID 23322)
-- Name: payments_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payments_status_idx ON public.payments USING btree (status);


--
-- TOC entry 5134 (class 1259 OID 23327)
-- Name: prescriptions_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "prescriptions_createdAt_idx" ON public.prescriptions USING btree ("createdAt");


--
-- TOC entry 5135 (class 1259 OID 23326)
-- Name: prescriptions_paid_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX prescriptions_paid_idx ON public.prescriptions USING btree (paid);


--
-- TOC entry 5138 (class 1259 OID 36772)
-- Name: prescriptions_visit_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX prescriptions_visit_id_idx ON public.prescriptions USING btree (visit_id);


--
-- TOC entry 5009 (class 1259 OID 23246)
-- Name: roles_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX roles_name_key ON public.roles USING btree (name);


--
-- TOC entry 5094 (class 1259 OID 23303)
-- Name: rooms_building_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rooms_building_id_idx ON public.rooms USING btree (building_id);


--
-- TOC entry 5095 (class 1259 OID 23305)
-- Name: rooms_floor_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rooms_floor_idx ON public.rooms USING btree (floor);


--
-- TOC entry 5098 (class 1259 OID 23304)
-- Name: rooms_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rooms_type_idx ON public.rooms USING btree (type);


--
-- TOC entry 5099 (class 1259 OID 23308)
-- Name: schedules_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX schedules_date_idx ON public.schedules USING btree (date);


--
-- TOC entry 5102 (class 1259 OID 23307)
-- Name: schedules_room_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX schedules_room_id_idx ON public.schedules USING btree (room_id);


--
-- TOC entry 5103 (class 1259 OID 23306)
-- Name: schedules_staff_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX schedules_staff_id_idx ON public.schedules USING btree (staff_id);


--
-- TOC entry 5104 (class 1259 OID 23309)
-- Name: schedules_start_time_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX schedules_start_time_idx ON public.schedules USING btree (start_time);


--
-- TOC entry 5061 (class 1259 OID 23280)
-- Name: sessions_expires_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_expires_at_idx ON public.sessions USING btree (expires_at);


--
-- TOC entry 5064 (class 1259 OID 23279)
-- Name: sessions_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_user_id_idx ON public.sessions USING btree (user_id);


--
-- TOC entry 5037 (class 1259 OID 23264)
-- Name: staffs_department_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX staffs_department_id_idx ON public.staffs USING btree (department_id);


--
-- TOC entry 5040 (class 1259 OID 23265)
-- Name: staffs_position_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX staffs_position_idx ON public.staffs USING btree ("position");


--
-- TOC entry 5041 (class 1259 OID 23263)
-- Name: staffs_staff_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX staffs_staff_id_key ON public.staffs USING btree (staff_id);


--
-- TOC entry 5012 (class 1259 OID 23249)
-- Name: users_address_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_address_id_key ON public.users USING btree (address_id);


--
-- TOC entry 5013 (class 1259 OID 27981)
-- Name: users_citizen_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_citizen_id_key ON public.users USING btree (citizen_id);


--
-- TOC entry 5014 (class 1259 OID 23253)
-- Name: users_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_created_at_idx ON public.users USING btree (created_at);


--
-- TOC entry 5015 (class 1259 OID 23248)
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- TOC entry 5018 (class 1259 OID 23252)
-- Name: users_role_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_role_id_idx ON public.users USING btree (role_id);


--
-- TOC entry 5019 (class 1259 OID 23247)
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- TOC entry 5026 (class 1259 OID 23260)
-- Name: verification_codes_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX verification_codes_code_idx ON public.verification_codes USING btree (code);


--
-- TOC entry 5027 (class 1259 OID 23259)
-- Name: verification_codes_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX verification_codes_email_idx ON public.verification_codes USING btree (email);


--
-- TOC entry 5028 (class 1259 OID 23262)
-- Name: verification_codes_expiresAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "verification_codes_expiresAt_idx" ON public.verification_codes USING btree ("expiresAt");


--
-- TOC entry 5031 (class 1259 OID 23261)
-- Name: verification_codes_used_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX verification_codes_used_idx ON public.verification_codes USING btree (used);


--
-- TOC entry 5032 (class 1259 OID 23258)
-- Name: verification_codes_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "verification_codes_userId_idx" ON public.verification_codes USING btree ("userId");


--
-- TOC entry 5190 (class 1259 OID 36764)
-- Name: visit_services_medical_service_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visit_services_medical_service_id_idx ON public.visit_services USING btree (medical_service_id);


--
-- TOC entry 5193 (class 1259 OID 36763)
-- Name: visit_services_visit_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visit_services_visit_id_idx ON public.visit_services USING btree (visit_id);


--
-- TOC entry 5180 (class 1259 OID 36756)
-- Name: visits_appointment_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visits_appointment_id_idx ON public.visits USING btree (appointment_id);


--
-- TOC entry 5181 (class 1259 OID 36761)
-- Name: visits_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visits_created_at_idx ON public.visits USING btree (created_at);


--
-- TOC entry 5182 (class 1259 OID 36758)
-- Name: visits_doctor_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visits_doctor_id_idx ON public.visits USING btree (doctor_id);


--
-- TOC entry 5183 (class 1259 OID 36757)
-- Name: visits_ehr_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visits_ehr_id_idx ON public.visits USING btree (ehr_id);


--
-- TOC entry 5184 (class 1259 OID 36762)
-- Name: visits_next_visit_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visits_next_visit_date_idx ON public.visits USING btree (next_visit_date);


--
-- TOC entry 5187 (class 1259 OID 36760)
-- Name: visits_start_time_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visits_start_time_idx ON public.visits USING btree (start_time);


--
-- TOC entry 5188 (class 1259 OID 36759)
-- Name: visits_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visits_status_idx ON public.visits USING btree (status);


--
-- TOC entry 5189 (class 1259 OID 36854)
-- Name: visits_status_start_time_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visits_status_start_time_idx ON public.visits USING btree (status, start_time);


--
-- TOC entry 5222 (class 2606 OID 23467)
-- Name: appointments appointments_booked_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_booked_by_user_id_fkey FOREIGN KEY (booked_by_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5223 (class 2606 OID 36823)
-- Name: appointments appointments_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5224 (class 2606 OID 23457)
-- Name: appointments appointments_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5225 (class 2606 OID 28976)
-- Name: appointments appointments_medical_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_medical_service_id_fkey FOREIGN KEY (medical_service_id) REFERENCES public.medical_services(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5226 (class 2606 OID 23462)
-- Name: appointments appointments_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5227 (class 2606 OID 25487)
-- Name: appointments appointments_schedule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_schedule_id_fkey FOREIGN KEY (schedule_id) REFERENCES public.schedules(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5207 (class 2606 OID 23357)
-- Name: authentications authentications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentications
    ADD CONSTRAINT authentications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5229 (class 2606 OID 23477)
-- Name: buildings buildings_hospital_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buildings
    ADD CONSTRAINT buildings_hospital_id_fkey FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5247 (class 2606 OID 23567)
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5254 (class 2606 OID 27993)
-- Name: contacts contacts_staff_id_reply_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_staff_id_reply_fkey FOREIGN KEY (staff_id_reply) REFERENCES public.staffs(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5255 (class 2606 OID 23597)
-- Name: contacts contacts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5251 (class 2606 OID 23582)
-- Name: conversations conversations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5216 (class 2606 OID 23402)
-- Name: department_deputies department_deputies_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_deputies
    ADD CONSTRAINT department_deputies_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5217 (class 2606 OID 23407)
-- Name: department_deputies department_deputies_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_deputies
    ADD CONSTRAINT "department_deputies_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.staffs(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5214 (class 2606 OID 23392)
-- Name: departments departments_head_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_head_id_fkey FOREIGN KEY (head_id) REFERENCES public.staffs(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5215 (class 2606 OID 23397)
-- Name: departments departments_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5237 (class 2606 OID 23517)
-- Name: doctor_services doctor_services_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor_services
    ADD CONSTRAINT doctor_services_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5238 (class 2606 OID 23522)
-- Name: doctor_services doctor_services_medical_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor_services
    ADD CONSTRAINT doctor_services_medical_service_id_fkey FOREIGN KEY (medical_service_id) REFERENCES public.medical_services(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5212 (class 2606 OID 23773)
-- Name: doctors doctors_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.staffs(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5221 (class 2606 OID 23427)
-- Name: ehrs ehrs_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ehrs
    ADD CONSTRAINT ehrs_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5256 (class 2606 OID 27982)
-- Name: emergency_contacts emergency_contacts_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emergency_contacts
    ADD CONSTRAINT emergency_contacts_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5248 (class 2606 OID 28005)
-- Name: health_articles health_articles_assignee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.health_articles
    ADD CONSTRAINT health_articles_assignee_id_fkey FOREIGN KEY (assignee_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5249 (class 2606 OID 23572)
-- Name: health_articles health_articles_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.health_articles
    ADD CONSTRAINT health_articles_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5250 (class 2606 OID 23577)
-- Name: health_articles health_articles_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.health_articles
    ADD CONSTRAINT health_articles_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5234 (class 2606 OID 23502)
-- Name: health_informations health_informations_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.health_informations
    ADD CONSTRAINT health_informations_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5220 (class 2606 OID 23422)
-- Name: health_insurances health_insurances_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.health_insurances
    ADD CONSTRAINT health_insurances_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.patients(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5228 (class 2606 OID 23472)
-- Name: hospitals hospitals_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT hospitals_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5267 (class 2606 OID 36833)
-- Name: invoice_items invoice_items_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5239 (class 2606 OID 28921)
-- Name: invoices invoices_health_insurance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_health_insurance_id_fkey FOREIGN KEY (health_insurance_id) REFERENCES public.health_insurances(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5240 (class 2606 OID 36828)
-- Name: invoices invoices_issued_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_issued_by_user_id_fkey FOREIGN KEY (issued_by_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5241 (class 2606 OID 23542)
-- Name: invoices invoices_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5213 (class 2606 OID 23387)
-- Name: managers managers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.managers
    ADD CONSTRAINT managers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.staffs(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5265 (class 2606 OID 36813)
-- Name: medical_records medical_records_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_records
    ADD CONSTRAINT medical_records_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5266 (class 2606 OID 36818)
-- Name: medical_records medical_records_visitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_records
    ADD CONSTRAINT "medical_records_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES public.visits(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5235 (class 2606 OID 23507)
-- Name: medical_services medical_services_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_services
    ADD CONSTRAINT medical_services_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5236 (class 2606 OID 23512)
-- Name: medical_services medical_services_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_services
    ADD CONSTRAINT medical_services_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5245 (class 2606 OID 23562)
-- Name: medicine_usages medicine_usages_medicine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicine_usages
    ADD CONSTRAINT medicine_usages_medicine_id_fkey FOREIGN KEY (medicine_id) REFERENCES public.medicines(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5246 (class 2606 OID 23557)
-- Name: medicine_usages medicine_usages_prescription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicine_usages
    ADD CONSTRAINT medicine_usages_prescription_id_fkey FOREIGN KEY (prescription_id) REFERENCES public.prescriptions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5252 (class 2606 OID 23587)
-- Name: messages messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5209 (class 2606 OID 23367)
-- Name: names names_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.names
    ADD CONSTRAINT names_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5253 (class 2606 OID 23592)
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5219 (class 2606 OID 23417)
-- Name: patients patients_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5242 (class 2606 OID 36838)
-- Name: payments payments_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5243 (class 2606 OID 36848)
-- Name: prescriptions prescriptions_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5244 (class 2606 OID 36843)
-- Name: prescriptions prescriptions_visit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES public.visits(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5230 (class 2606 OID 23482)
-- Name: rooms rooms_building_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_building_id_fkey FOREIGN KEY (building_id) REFERENCES public.buildings(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5231 (class 2606 OID 23487)
-- Name: schedules schedules_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5232 (class 2606 OID 23492)
-- Name: schedules schedules_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5233 (class 2606 OID 23497)
-- Name: schedules schedules_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staffs(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5218 (class 2606 OID 23412)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5210 (class 2606 OID 23372)
-- Name: staffs staffs_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staffs
    ADD CONSTRAINT staffs_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5211 (class 2606 OID 23377)
-- Name: staffs staffs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staffs
    ADD CONSTRAINT staffs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5205 (class 2606 OID 23347)
-- Name: users users_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5206 (class 2606 OID 23352)
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5208 (class 2606 OID 23362)
-- Name: verification_codes verification_codes_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_codes
    ADD CONSTRAINT "verification_codes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5262 (class 2606 OID 36803)
-- Name: visit_services visit_services_medical_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visit_services
    ADD CONSTRAINT visit_services_medical_service_id_fkey FOREIGN KEY (medical_service_id) REFERENCES public.medical_services(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5263 (class 2606 OID 36808)
-- Name: visit_services visit_services_ordered_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visit_services
    ADD CONSTRAINT visit_services_ordered_by_user_id_fkey FOREIGN KEY (ordered_by_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5264 (class 2606 OID 36798)
-- Name: visit_services visit_services_visit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visit_services
    ADD CONSTRAINT visit_services_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES public.visits(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5257 (class 2606 OID 36773)
-- Name: visits visits_appointment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5258 (class 2606 OID 36783)
-- Name: visits visits_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5259 (class 2606 OID 36778)
-- Name: visits visits_ehr_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_ehr_id_fkey FOREIGN KEY (ehr_id) REFERENCES public.ehrs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5260 (class 2606 OID 36793)
-- Name: visits visits_medical_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_medical_service_id_fkey FOREIGN KEY (medical_service_id) REFERENCES public.medical_services(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5261 (class 2606 OID 36788)
-- Name: visits visits_patientUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT "visits_patientUserId_fkey" FOREIGN KEY ("patientUserId") REFERENCES public.patients(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Completed on 2026-01-15 22:20:57

--
-- PostgreSQL database dump complete
--

\unrestrict H7h7NWBWan3H4IwWrhviuR6iW6kp4ePe5wuZm4PV30cL7LbCqhsbc5vwKzTOiHZ

