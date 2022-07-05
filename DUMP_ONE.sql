--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: nick
--

CREATE TYPE public."Role" AS ENUM (
    'DRIVER',
    'MANAGER',
    'OWNER',
    'SUPERADMIN'
);


ALTER TYPE public."Role" OWNER TO nick;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Accident; Type: TABLE; Schema: public; Owner: nick
--

CREATE TABLE public."Accident" (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name text NOT NULL,
    date text NOT NULL,
    "time" text NOT NULL,
    location text NOT NULL,
    accident_report jsonb,
    police_report jsonb,
    before_accident_report jsonb,
    "selfDamage" jsonb,
    weather_and_distractions jsonb,
    deleted boolean DEFAULT false NOT NULL,
    filled boolean DEFAULT false NOT NULL,
    "driverId" text NOT NULL,
    "dspId" text NOT NULL
);


ALTER TABLE public."Accident" OWNER TO nick;

--
-- Name: AnnouncementMessages; Type: TABLE; Schema: public; Owner: nick
--

CREATE TABLE public."AnnouncementMessages" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "sentAt" text NOT NULL,
    content text NOT NULL,
    "from" jsonb NOT NULL,
    "readBy" jsonb[],
    "readyByIds" text[],
    "chatroomId" text NOT NULL,
    "ownerId" text,
    "dspId" text,
    "managerId" text
);


ALTER TABLE public."AnnouncementMessages" OWNER TO nick;

--
-- Name: AnnouncementMessages_id_seq; Type: SEQUENCE; Schema: public; Owner: nick
--

CREATE SEQUENCE public."AnnouncementMessages_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."AnnouncementMessages_id_seq" OWNER TO nick;

--
-- Name: AnnouncementMessages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nick
--

ALTER SEQUENCE public."AnnouncementMessages_id_seq" OWNED BY public."AnnouncementMessages".id;


--
-- Name: Chatroom; Type: TABLE; Schema: public; Owner: nick
--

CREATE TABLE public."Chatroom" (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "chatroomName" text NOT NULL,
    guests jsonb[],
    "mutedIds" text[],
    "chatroomOwner" jsonb NOT NULL,
    "announcementChat" boolean DEFAULT false NOT NULL,
    "driverJoinOnSignUp" boolean DEFAULT false NOT NULL,
    "managerJoinOnSignUp" boolean DEFAULT true NOT NULL,
    "ownerId" text
);


ALTER TABLE public."Chatroom" OWNER TO nick;

--
-- Name: CollisionAccident; Type: TABLE; Schema: public; Owner: nick
--

CREATE TABLE public."CollisionAccident" (
    id text NOT NULL,
    specific_pictures jsonb NOT NULL,
    contact_info jsonb NOT NULL,
    extra_info text,
    collision_report jsonb NOT NULL,
    "accidentId" text NOT NULL
);


ALTER TABLE public."CollisionAccident" OWNER TO nick;

--
-- Name: Device; Type: TABLE; Schema: public; Owner: nick
--

CREATE TABLE public."Device" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    number text,
    name text,
    type text,
    "deviceIndex" integer,
    "driverId" text,
    "dspId" text NOT NULL
);


ALTER TABLE public."Device" OWNER TO nick;

--
-- Name: Device_id_seq; Type: SEQUENCE; Schema: public; Owner: nick
--

CREATE SEQUENCE public."Device_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Device_id_seq" OWNER TO nick;

--
-- Name: Device_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nick
--

ALTER SEQUENCE public."Device_id_seq" OWNED BY public."Device".id;


--
-- Name: Driver; Type: TABLE; Schema: public; Owner: nick
--

CREATE TABLE public."Driver" (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    role public."Role" DEFAULT 'DRIVER'::public."Role" NOT NULL,
    token text,
    firstname text NOT NULL,
    lastname text NOT NULL,
    email text NOT NULL,
    "phoneNumber" text,
    password text,
    "profilePick" jsonb,
    shifts jsonb[],
    "transporterId" text,
    "globallyMuted" boolean DEFAULT false NOT NULL,
    "mutedIds" text[],
    locked boolean DEFAULT false NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    attendence text,
    notified boolean DEFAULT false NOT NULL,
    "resetPasswordToken" text,
    "resetPasswordTokenExpiration" text,
    "ownerId" text NOT NULL,
    "dspId" text,
    "dspTransporter" text NOT NULL
);


ALTER TABLE public."Driver" OWNER TO nick;

--
-- Name: Dsp; Type: TABLE; Schema: public; Owner: nick
--

CREATE TABLE public."Dsp" (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name text NOT NULL,
    shortcode text NOT NULL,
    "timeZone" text NOT NULL,
    "ficoLimits" jsonb NOT NULL,
    "seatbeltLimits" jsonb NOT NULL,
    "speedingLimits" jsonb NOT NULL,
    "distractionLimits" jsonb NOT NULL,
    "followLimits" jsonb NOT NULL,
    "signalLimits" jsonb NOT NULL,
    "deliveryCompletionRateLimits" jsonb NOT NULL,
    "deliveryNotRecievedLimits" jsonb NOT NULL,
    "photoOnDeliveryLimits" jsonb NOT NULL,
    "topCardLimits" integer NOT NULL,
    "smallCardLimits" integer NOT NULL,
    "feedbackNotifications" jsonb NOT NULL,
    "autoSend" jsonb NOT NULL,
    "allDevices" jsonb[],
    paid boolean DEFAULT false NOT NULL,
    "accountStanding" text DEFAULT 'Free'::text NOT NULL,
    "subscriptionToken" text NOT NULL,
    "subscriptionStartDate" text NOT NULL,
    "subscriptionEndDate" text NOT NULL,
    "stripeCustomerId" text,
    "autoPayEnabled" boolean DEFAULT false NOT NULL,
    "ownerId" text NOT NULL
);


ALTER TABLE public."Dsp" OWNER TO nick;

--
-- Name: InjuryAccident; Type: TABLE; Schema: public; Owner: nick
--

CREATE TABLE public."InjuryAccident" (
    id text NOT NULL,
    contact_info jsonb NOT NULL,
    extra_info text,
    injured_areas jsonb NOT NULL,
    injury_report jsonb NOT NULL,
    pain_level text NOT NULL,
    specific_pictures jsonb NOT NULL,
    "accidentId" text NOT NULL,
    "collisionAccidentId" text
);


ALTER TABLE public."InjuryAccident" OWNER TO nick;

--
-- Name: Manager; Type: TABLE; Schema: public; Owner: nick
--

CREATE TABLE public."Manager" (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    role public."Role" DEFAULT 'MANAGER'::public."Role" NOT NULL,
    token text,
    firstname text NOT NULL,
    lastname text NOT NULL,
    email text NOT NULL,
    "phoneNumber" text NOT NULL,
    password text NOT NULL,
    "profilePick" jsonb,
    muted boolean DEFAULT false NOT NULL,
    locked boolean DEFAULT false NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    notified boolean DEFAULT false NOT NULL,
    "resetPasswordToken" text,
    "resetPasswordTokenExpiration" integer,
    "ownerId" text NOT NULL,
    "mutedListIds" text[],
    "dspId" text
);


ALTER TABLE public."Manager" OWNER TO nick;

--
-- Name: Messages; Type: TABLE; Schema: public; Owner: nick
--

CREATE TABLE public."Messages" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    content text NOT NULL,
    "sentAt" text,
    "from" jsonb NOT NULL,
    visable boolean DEFAULT true NOT NULL,
    reported boolean DEFAULT false NOT NULL,
    "reportedBy" jsonb,
    "chatroomId" text NOT NULL,
    "ownerId" text,
    "managerId" text,
    "driverId" text
);


ALTER TABLE public."Messages" OWNER TO nick;

--
-- Name: Messages_id_seq; Type: SEQUENCE; Schema: public; Owner: nick
--

CREATE SEQUENCE public."Messages_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Messages_id_seq" OWNER TO nick;

--
-- Name: Messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nick
--

ALTER SEQUENCE public."Messages_id_seq" OWNED BY public."Messages".id;


--
-- Name: NotifiedMessages; Type: TABLE; Schema: public; Owner: nick
--

CREATE TABLE public."NotifiedMessages" (
    id integer NOT NULL,
    "createdAt" text NOT NULL,
    "sentAt" text NOT NULL,
    date text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    "readAt" text NOT NULL,
    content text NOT NULL,
    "from" text NOT NULL,
    type text NOT NULL,
    "driverId" text,
    "dspId" text
);


ALTER TABLE public."NotifiedMessages" OWNER TO nick;

--
-- Name: NotifiedMessages_id_seq; Type: SEQUENCE; Schema: public; Owner: nick
--

CREATE SEQUENCE public."NotifiedMessages_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."NotifiedMessages_id_seq" OWNER TO nick;

--
-- Name: NotifiedMessages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nick
--

ALTER SEQUENCE public."NotifiedMessages_id_seq" OWNED BY public."NotifiedMessages".id;


--
-- Name: Owner; Type: TABLE; Schema: public; Owner: nick
--

CREATE TABLE public."Owner" (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    role public."Role" DEFAULT 'OWNER'::public."Role" NOT NULL,
    token text,
    firstname text NOT NULL,
    lastname text NOT NULL,
    email text NOT NULL,
    "phoneNumber" text NOT NULL,
    password text NOT NULL,
    "profilePick" jsonb,
    locked boolean DEFAULT false NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    notified boolean DEFAULT false NOT NULL,
    "resetPasswordToken" text,
    "resetPasswordTokenExpiration" integer,
    "signUpToken" text,
    "subscriptionToken" text,
    "subscriptionStartDate" text,
    "subscriptionEndDate" text,
    "stripeCustomerId" text,
    "autoPayEnabled" boolean DEFAULT false NOT NULL,
    "mutedListIds" text[]
);


ALTER TABLE public."Owner" OWNER TO nick;

--
-- Name: PropertyAccident; Type: TABLE; Schema: public; Owner: nick
--

CREATE TABLE public."PropertyAccident" (
    id text NOT NULL,
    contact_info jsonb NOT NULL,
    damage_report jsonb NOT NULL,
    defective_equip text[],
    safety_equip text[],
    package_report jsonb,
    specific_pictures jsonb NOT NULL,
    extra_info text,
    types_of_damage jsonb NOT NULL,
    "accidentId" text NOT NULL
);


ALTER TABLE public."PropertyAccident" OWNER TO nick;

--
-- Name: SelfInjuryAccident; Type: TABLE; Schema: public; Owner: nick
--

CREATE TABLE public."SelfInjuryAccident" (
    id text NOT NULL,
    animal_report jsonb,
    injuries jsonb NOT NULL,
    injury_report jsonb NOT NULL,
    extra_info text,
    specific_pictures jsonb NOT NULL,
    "accidentId" text NOT NULL
);


ALTER TABLE public."SelfInjuryAccident" OWNER TO nick;

--
-- Name: Shift; Type: TABLE; Schema: public; Owner: nick
--

CREATE TABLE public."Shift" (
    id text NOT NULL,
    date text NOT NULL,
    "dateDsp" text NOT NULL,
    "allDriverShifts" jsonb[],
    "dspId" text NOT NULL,
    "shiftMessage" text NOT NULL
);


ALTER TABLE public."Shift" OWNER TO nick;

--
-- Name: SuperUser; Type: TABLE; Schema: public; Owner: nick
--

CREATE TABLE public."SuperUser" (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    role public."Role" DEFAULT 'SUPERADMIN'::public."Role" NOT NULL,
    token text,
    firstname text NOT NULL,
    lastname text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "phoneNumber" text NOT NULL,
    "profilePick" jsonb
);


ALTER TABLE public."SuperUser" OWNER TO nick;

--
-- Name: WeeklyReport; Type: TABLE; Schema: public; Owner: nick
--

CREATE TABLE public."WeeklyReport" (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date text NOT NULL,
    "hadAccident" boolean DEFAULT false NOT NULL,
    "feedbackMessage" text,
    "feedbackStatus" text,
    "feedbackMessageSent" boolean DEFAULT false NOT NULL,
    acknowledged boolean DEFAULT false NOT NULL,
    "acknowledgedAt" text,
    rank integer,
    tier text,
    delivered integer,
    "keyFocusArea" text,
    fico text,
    "seatbeltOffRate" text,
    "speedingEventRate" text,
    "distractionsRate" text,
    "followingDistanceRate" text,
    "signalViolationsRate" text,
    "deliveryCompletionRate" text,
    "deliveredAndRecieved" text,
    "photoOnDelivery" text,
    "customerDeliveryFeedback" text,
    "attendedDeliveryAccuracy" integer,
    dnr integer,
    "podOpps" integer,
    "ccOpps" integer,
    netradyne jsonb,
    "deliveryAssociate" jsonb,
    defects jsonb,
    "hasManyAccidents" jsonb,
    "belongsToTeam" jsonb,
    attendance jsonb,
    productivity jsonb,
    "driverId" text NOT NULL,
    "dspId" text NOT NULL
);


ALTER TABLE public."WeeklyReport" OWNER TO nick;

--
-- Name: _ChatroomToDriver; Type: TABLE; Schema: public; Owner: nick
--

CREATE TABLE public."_ChatroomToDriver" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ChatroomToDriver" OWNER TO nick;

--
-- Name: _ChatroomToManager; Type: TABLE; Schema: public; Owner: nick
--

CREATE TABLE public."_ChatroomToManager" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ChatroomToManager" OWNER TO nick;

--
-- Name: _DriverToManager; Type: TABLE; Schema: public; Owner: nick
--

CREATE TABLE public."_DriverToManager" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_DriverToManager" OWNER TO nick;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: nick
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO nick;

--
-- Name: AnnouncementMessages id; Type: DEFAULT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."AnnouncementMessages" ALTER COLUMN id SET DEFAULT nextval('public."AnnouncementMessages_id_seq"'::regclass);


--
-- Name: Device id; Type: DEFAULT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Device" ALTER COLUMN id SET DEFAULT nextval('public."Device_id_seq"'::regclass);


--
-- Name: Messages id; Type: DEFAULT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Messages" ALTER COLUMN id SET DEFAULT nextval('public."Messages_id_seq"'::regclass);


--
-- Name: NotifiedMessages id; Type: DEFAULT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."NotifiedMessages" ALTER COLUMN id SET DEFAULT nextval('public."NotifiedMessages_id_seq"'::regclass);


--
-- Data for Name: Accident; Type: TABLE DATA; Schema: public; Owner: nick
--

COPY public."Accident" (id, "createdAt", name, date, "time", location, accident_report, police_report, before_accident_report, "selfDamage", weather_and_distractions, deleted, filled, "driverId", "dspId") FROM stdin;
\.


--
-- Data for Name: AnnouncementMessages; Type: TABLE DATA; Schema: public; Owner: nick
--

COPY public."AnnouncementMessages" (id, "createdAt", "sentAt", content, "from", "readBy", "readyByIds", "chatroomId", "ownerId", "dspId", "managerId") FROM stdin;
\.


--
-- Data for Name: Chatroom; Type: TABLE DATA; Schema: public; Owner: nick
--

COPY public."Chatroom" (id, "createdAt", "chatroomName", guests, "mutedIds", "chatroomOwner", "announcementChat", "driverJoinOnSignUp", "managerJoinOnSignUp", "ownerId") FROM stdin;
b76cddcb-9f6d-4ccf-a7f9-0941d7cda744	2022-07-02 15:48:05.415	TEST management chatroom	{"{\\"id\\": \\"872c6504-3ea4-4c7c-97a3-c9a71679c8d9\\", \\"role\\": \\"OWNER\\", \\"email\\": \\"NICK@KINGWILLYSTUDIOS.COM\\", \\"token\\": \\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg3MmM2NTA0LTNlYTQtNGM3Yy05N2EzLWM5YTcxNjc5YzhkOSIsImlhdCI6MTY1Njc3NjUyNywiZXhwIjoxNjU3MzgxMzI3fQ.UYd7a_n6Kp86NCb1yYSz_G9ZsB4iOFeGZr6zI_Zg41U\\", \\"locked\\": false, \\"deleted\\": false, \\"lastname\\": \\"LANESE\\", \\"notified\\": false, \\"password\\": \\"$2a$10$2ahJFfxCBOcxAHmY6nRHtuJQtPy3nE.D62Z2ti95yPaDm486HFaKS\\", \\"createdAt\\": \\"2022-07-02T15:24:59.234Z\\", \\"firstname\\": \\"NICK A\\", \\"phoneNumber\\": \\"9735256541\\", \\"profilePick\\": \\"Default\\", \\"signUpToken\\": \\"M8Nl3Cc492\\", \\"mutedListIds\\": [], \\"autoPayEnabled\\": false, \\"stripeCustomerId\\": null, \\"subscriptionToken\\": \\"Free\\", \\"resetPasswordToken\\": null, \\"subscriptionEndDate\\": \\"Free-Version\\", \\"subscriptionStartDate\\": \\"Free-Version\\", \\"resetPasswordTokenExpiration\\": null}"}	{}	{"id": "872c6504-3ea4-4c7c-97a3-c9a71679c8d9", "role": "OWNER", "email": "NICK@KINGWILLYSTUDIOS.COM", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg3MmM2NTA0LTNlYTQtNGM3Yy05N2EzLWM5YTcxNjc5YzhkOSIsImlhdCI6MTY1Njc3NjUyNywiZXhwIjoxNjU3MzgxMzI3fQ.UYd7a_n6Kp86NCb1yYSz_G9ZsB4iOFeGZr6zI_Zg41U", "locked": false, "deleted": false, "lastname": "LANESE", "notified": false, "password": "$2a$10$2ahJFfxCBOcxAHmY6nRHtuJQtPy3nE.D62Z2ti95yPaDm486HFaKS", "createdAt": "2022-07-02T15:24:59.234Z", "firstname": "NICK A", "phoneNumber": "9735256541", "profilePick": "Default", "signUpToken": "M8Nl3Cc492", "mutedListIds": [], "autoPayEnabled": false, "stripeCustomerId": null, "subscriptionToken": "Free", "resetPasswordToken": null, "subscriptionEndDate": "Free-Version", "subscriptionStartDate": "Free-Version", "resetPasswordTokenExpiration": null}	f	f	t	872c6504-3ea4-4c7c-97a3-c9a71679c8d9
9a5b38e7-ae4d-4e32-b087-d81f243f828c	2022-07-02 19:01:26.104	QWERTYU Announcements	{"{\\"id\\": \\"d6f5a900-9972-4027-833c-60847fabdbd2\\", \\"role\\": \\"OWNER\\", \\"email\\": \\"NICK@KINSGWILLYSTUDIOS.COM\\", \\"token\\": \\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ2ZjVhOTAwLTk5NzItNDAyNy04MzNjLTYwODQ3ZmFiZGJkMiIsImlhdCI6MTY1Njc4ODMyNiwiZXhwIjoxNjU3MzkzMTI2fQ.T-xaQ5HsovCReMzlhtvocyyp-UMcZURIcJq3QNSYer8\\", \\"locked\\": false, \\"deleted\\": false, \\"lastname\\": \\"LANESE\\", \\"notified\\": false, \\"password\\": \\"$2a$10$CpHMCYKKzQczE/0sV9nuRu0I5pmIo3gjT7lRO/tOk5aXPttDBEPvy\\", \\"createdAt\\": \\"2022-07-02T18:58:46.379Z\\", \\"firstname\\": \\"NICK A\\", \\"phoneNumber\\": \\"9735256541\\", \\"profilePick\\": \\"Default\\", \\"signUpToken\\": \\"J24dFprLKC\\", \\"mutedListIds\\": [], \\"autoPayEnabled\\": false, \\"stripeCustomerId\\": null, \\"subscriptionToken\\": \\"Free\\", \\"resetPasswordToken\\": null, \\"subscriptionEndDate\\": \\"Free-Version\\", \\"subscriptionStartDate\\": \\"Free-Version\\", \\"resetPasswordTokenExpiration\\": null}"}	{}	{"id": "d6f5a900-9972-4027-833c-60847fabdbd2", "role": "OWNER", "email": "NICK@KINSGWILLYSTUDIOS.COM", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ2ZjVhOTAwLTk5NzItNDAyNy04MzNjLTYwODQ3ZmFiZGJkMiIsImlhdCI6MTY1Njc4ODMyNiwiZXhwIjoxNjU3MzkzMTI2fQ.T-xaQ5HsovCReMzlhtvocyyp-UMcZURIcJq3QNSYer8", "locked": false, "deleted": false, "lastname": "LANESE", "notified": false, "password": "$2a$10$CpHMCYKKzQczE/0sV9nuRu0I5pmIo3gjT7lRO/tOk5aXPttDBEPvy", "createdAt": "2022-07-02T18:58:46.379Z", "firstname": "NICK A", "phoneNumber": "9735256541", "profilePick": "Default", "signUpToken": "J24dFprLKC", "mutedListIds": [], "autoPayEnabled": false, "stripeCustomerId": null, "subscriptionToken": "Free", "resetPasswordToken": null, "subscriptionEndDate": "Free-Version", "subscriptionStartDate": "Free-Version", "resetPasswordTokenExpiration": null}	t	t	t	d6f5a900-9972-4027-833c-60847fabdbd2
98d2d56b-7279-4adc-b677-e05ec5c6cd85	2022-07-02 19:01:26.118	QWERTYU management chatroom	{"{\\"id\\": \\"d6f5a900-9972-4027-833c-60847fabdbd2\\", \\"role\\": \\"OWNER\\", \\"email\\": \\"NICK@KINSGWILLYSTUDIOS.COM\\", \\"token\\": \\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ2ZjVhOTAwLTk5NzItNDAyNy04MzNjLTYwODQ3ZmFiZGJkMiIsImlhdCI6MTY1Njc4ODMyNiwiZXhwIjoxNjU3MzkzMTI2fQ.T-xaQ5HsovCReMzlhtvocyyp-UMcZURIcJq3QNSYer8\\", \\"locked\\": false, \\"deleted\\": false, \\"lastname\\": \\"LANESE\\", \\"notified\\": false, \\"password\\": \\"$2a$10$CpHMCYKKzQczE/0sV9nuRu0I5pmIo3gjT7lRO/tOk5aXPttDBEPvy\\", \\"createdAt\\": \\"2022-07-02T18:58:46.379Z\\", \\"firstname\\": \\"NICK A\\", \\"phoneNumber\\": \\"9735256541\\", \\"profilePick\\": \\"Default\\", \\"signUpToken\\": \\"J24dFprLKC\\", \\"mutedListIds\\": [], \\"autoPayEnabled\\": false, \\"stripeCustomerId\\": null, \\"subscriptionToken\\": \\"Free\\", \\"resetPasswordToken\\": null, \\"subscriptionEndDate\\": \\"Free-Version\\", \\"subscriptionStartDate\\": \\"Free-Version\\", \\"resetPasswordTokenExpiration\\": null}"}	{}	{"id": "d6f5a900-9972-4027-833c-60847fabdbd2", "role": "OWNER", "email": "NICK@KINSGWILLYSTUDIOS.COM", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ2ZjVhOTAwLTk5NzItNDAyNy04MzNjLTYwODQ3ZmFiZGJkMiIsImlhdCI6MTY1Njc4ODMyNiwiZXhwIjoxNjU3MzkzMTI2fQ.T-xaQ5HsovCReMzlhtvocyyp-UMcZURIcJq3QNSYer8", "locked": false, "deleted": false, "lastname": "LANESE", "notified": false, "password": "$2a$10$CpHMCYKKzQczE/0sV9nuRu0I5pmIo3gjT7lRO/tOk5aXPttDBEPvy", "createdAt": "2022-07-02T18:58:46.379Z", "firstname": "NICK A", "phoneNumber": "9735256541", "profilePick": "Default", "signUpToken": "J24dFprLKC", "mutedListIds": [], "autoPayEnabled": false, "stripeCustomerId": null, "subscriptionToken": "Free", "resetPasswordToken": null, "subscriptionEndDate": "Free-Version", "subscriptionStartDate": "Free-Version", "resetPasswordTokenExpiration": null}	f	f	t	d6f5a900-9972-4027-833c-60847fabdbd2
ee41a6eb-00b5-49bf-a247-574d9fcc101f	2022-07-02 15:48:05.397	TEST Announcements	{"{\\"id\\": \\"872c6504-3ea4-4c7c-97a3-c9a71679c8d9\\", \\"role\\": \\"OWNER\\", \\"email\\": \\"NICK@KINGWILLYSTUDIOS.COM\\", \\"token\\": \\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg3MmM2NTA0LTNlYTQtNGM3Yy05N2EzLWM5YTcxNjc5YzhkOSIsImlhdCI6MTY1Njc3NjUyNywiZXhwIjoxNjU3MzgxMzI3fQ.UYd7a_n6Kp86NCb1yYSz_G9ZsB4iOFeGZr6zI_Zg41U\\", \\"locked\\": false, \\"deleted\\": false, \\"lastname\\": \\"LANESE\\", \\"notified\\": false, \\"password\\": \\"$2a$10$2ahJFfxCBOcxAHmY6nRHtuJQtPy3nE.D62Z2ti95yPaDm486HFaKS\\", \\"createdAt\\": \\"2022-07-02T15:24:59.234Z\\", \\"firstname\\": \\"NICK A\\", \\"phoneNumber\\": \\"9735256541\\", \\"profilePick\\": \\"Default\\", \\"signUpToken\\": \\"M8Nl3Cc492\\", \\"mutedListIds\\": [], \\"autoPayEnabled\\": false, \\"stripeCustomerId\\": null, \\"subscriptionToken\\": \\"Free\\", \\"resetPasswordToken\\": null, \\"subscriptionEndDate\\": \\"Free-Version\\", \\"subscriptionStartDate\\": \\"Free-Version\\", \\"resetPasswordTokenExpiration\\": null}","{\\"id\\": \\"78537f20-48ba-4c4a-840c-6f6a78d1da05\\", \\"role\\": \\"DRIVER\\", \\"dspId\\": \\"2529f1d1-d5f4-4c28-bf9a-8eef3f39624d\\", \\"email\\": \\"FAKEEMAIL1@GMAIL.COM\\", \\"token\\": null, \\"locked\\": false, \\"shifts\\": [], \\"deleted\\": false, \\"ownerId\\": \\"872c6504-3ea4-4c7c-97a3-c9a71679c8d9\\", \\"lastname\\": \\"SPARREY\\", \\"mutedIds\\": [], \\"notified\\": false, \\"password\\": \\"$2a$10$1mzkNQJRJT4V95mKfq4H9.oNbdFckU9587NNzfb8ks/qR0.HbAKZC\\", \\"createdAt\\": \\"2022-07-02T15:48:16.158Z\\", \\"firstname\\": \\"ADAM\\", \\"attendence\\": null, \\"phoneNumber\\": \\"973-525-5672\\\\r\\", \\"profilePick\\": \\"Default\\", \\"globallyMuted\\": false, \\"transporterId\\": \\"ABCTEST1\\", \\"dspTransporter\\": \\"2529f1d1-d5f4-4c28-bf9a-8eef3f39624dABCTEST1\\", \\"resetPasswordToken\\": null, \\"resetPasswordTokenExpiration\\": null}","{\\"id\\": \\"c14853a6-9be5-4e10-b09f-55e00223304f\\", \\"role\\": \\"DRIVER\\", \\"dspId\\": \\"2529f1d1-d5f4-4c28-bf9a-8eef3f39624d\\", \\"email\\": \\"FAKEEMAIL3@GMAIL.COM\\", \\"token\\": null, \\"locked\\": false, \\"shifts\\": [], \\"deleted\\": false, \\"ownerId\\": \\"872c6504-3ea4-4c7c-97a3-c9a71679c8d9\\", \\"lastname\\": \\"STITT\\", \\"mutedIds\\": [], \\"notified\\": false, \\"password\\": \\"$2a$10$NQswkWJORnmXryOBMhiFkOD9WleCUF/72EQep2wQm1JnoqkbrMlxa\\", \\"createdAt\\": \\"2022-07-02T18:50:52.020Z\\", \\"firstname\\": \\"DANIEL\\", \\"attendence\\": null, \\"phoneNumber\\": \\"877-393-4446\\\\r\\", \\"profilePick\\": \\"Default\\", \\"globallyMuted\\": false, \\"transporterId\\": \\"ABCTEST3\\", \\"dspTransporter\\": \\"2529f1d1-d5f4-4c28-bf9a-8eef3f39624dABCTEST3\\", \\"resetPasswordToken\\": null, \\"resetPasswordTokenExpiration\\": null}","{\\"id\\": \\"f07b3478-d42c-4888-8da3-177e6c4a9752\\", \\"role\\": \\"DRIVER\\", \\"dspId\\": \\"2529f1d1-d5f4-4c28-bf9a-8eef3f39624d\\", \\"email\\": \\"FAKEEMAIL20@GMAIL.COM\\", \\"token\\": null, \\"locked\\": false, \\"shifts\\": [], \\"deleted\\": false, \\"ownerId\\": \\"872c6504-3ea4-4c7c-97a3-c9a71679c8d9\\", \\"lastname\\": \\"SANCHEZZ\\", \\"mutedIds\\": [], \\"notified\\": false, \\"password\\": \\"$2a$10$PTvoUDTsSsMQh2Or3m/w0uMS1rPOVlImP4GoMJYXqrZAD3Z2BzIAe\\", \\"createdAt\\": \\"2022-07-02T18:51:09.276Z\\", \\"firstname\\": \\"RICK\\", \\"attendence\\": null, \\"phoneNumber\\": \\"1-877-3137-4-3337\\", \\"profilePick\\": \\"Default\\", \\"globallyMuted\\": false, \\"transporterId\\": \\"ABCTEST20\\", \\"dspTransporter\\": \\"2529f1d1-d5f4-4c28-bf9a-8eef3f39624dABCTEST20\\", \\"resetPasswordToken\\": null, \\"resetPasswordTokenExpiration\\": null}","{\\"id\\": \\"db42edeb-b7fd-4a89-9b83-c7890933a89f\\", \\"role\\": \\"DRIVER\\", \\"dspId\\": \\"2529f1d1-d5f4-4c28-bf9a-8eef3f39624d\\", \\"email\\": \\"FAKEEMAIL4@GMAIL.COM\\", \\"token\\": null, \\"locked\\": false, \\"shifts\\": [], \\"deleted\\": false, \\"ownerId\\": \\"872c6504-3ea4-4c7c-97a3-c9a71679c8d9\\", \\"lastname\\": \\"HAMMOND\\", \\"mutedIds\\": [], \\"notified\\": false, \\"password\\": \\"$2a$10$UonWcDuyWDa1G9kbh7aKlubJxu5c/ckTjvT2S6EBe.kIrd3hPIf92\\", \\"createdAt\\": \\"2022-07-02T18:54:53.959Z\\", \\"firstname\\": \\"BETH\\", \\"attendence\\": null, \\"phoneNumber\\": \\"877-393-4447\\\\r\\", \\"profilePick\\": \\"Default\\", \\"globallyMuted\\": false, \\"transporterId\\": \\"ABCTEST4\\", \\"dspTransporter\\": \\"2529f1d1-d5f4-4c28-bf9a-8eef3f39624dABCTEST4\\", \\"resetPasswordToken\\": null, \\"resetPasswordTokenExpiration\\": null}"}	{}	{"id": "872c6504-3ea4-4c7c-97a3-c9a71679c8d9", "role": "OWNER", "email": "NICK@KINGWILLYSTUDIOS.COM", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg3MmM2NTA0LTNlYTQtNGM3Yy05N2EzLWM5YTcxNjc5YzhkOSIsImlhdCI6MTY1Njc3NjUyNywiZXhwIjoxNjU3MzgxMzI3fQ.UYd7a_n6Kp86NCb1yYSz_G9ZsB4iOFeGZr6zI_Zg41U", "locked": false, "deleted": false, "lastname": "LANESE", "notified": false, "password": "$2a$10$2ahJFfxCBOcxAHmY6nRHtuJQtPy3nE.D62Z2ti95yPaDm486HFaKS", "createdAt": "2022-07-02T15:24:59.234Z", "firstname": "NICK A", "phoneNumber": "9735256541", "profilePick": "Default", "signUpToken": "M8Nl3Cc492", "mutedListIds": [], "autoPayEnabled": false, "stripeCustomerId": null, "subscriptionToken": "Free", "resetPasswordToken": null, "subscriptionEndDate": "Free-Version", "subscriptionStartDate": "Free-Version", "resetPasswordTokenExpiration": null}	t	t	t	872c6504-3ea4-4c7c-97a3-c9a71679c8d9
6a0dbd6e-cf58-4932-8830-e6c0a928c682	2022-07-04 21:47:45.494	TEST2 management chatroom	{"{\\"id\\": \\"537a2943-5caa-4aa9-82fb-7622fee61142\\", \\"role\\": \\"OWNER\\", \\"email\\": \\"NICK@KI2NGWILLYSTUDIOS.COM\\", \\"token\\": \\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUzN2EyOTQzLTVjYWEtNGFhOS04MmZiLTc2MjJmZWU2MTE0MiIsImlhdCI6MTY1Njk3MTIyMCwiZXhwIjoxNjU3NTc2MDIwfQ.dGm1bmFNXbF2XylqnsJe8ylVYvWOKwnz4x9MkL5TJi4\\", \\"locked\\": false, \\"deleted\\": false, \\"lastname\\": \\"LANESE\\", \\"notified\\": false, \\"password\\": \\"$2a$10$B71UfswJ91voB8GGErHdfeScWJUVasQuOU/1Sc/vLFYLbhZpH/zzq\\", \\"createdAt\\": \\"2022-07-04T21:47:00.856Z\\", \\"firstname\\": \\"NICK A\\", \\"phoneNumber\\": \\"9735256541\\", \\"profilePick\\": \\"Default\\", \\"signUpToken\\": \\"6j4j31Rns7\\", \\"mutedListIds\\": [], \\"autoPayEnabled\\": false, \\"stripeCustomerId\\": null, \\"subscriptionToken\\": \\"Free\\", \\"resetPasswordToken\\": null, \\"subscriptionEndDate\\": \\"Free-Version\\", \\"subscriptionStartDate\\": \\"Free-Version\\", \\"resetPasswordTokenExpiration\\": null}"}	{}	{"id": "537a2943-5caa-4aa9-82fb-7622fee61142", "role": "OWNER", "email": "NICK@KI2NGWILLYSTUDIOS.COM", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUzN2EyOTQzLTVjYWEtNGFhOS04MmZiLTc2MjJmZWU2MTE0MiIsImlhdCI6MTY1Njk3MTIyMCwiZXhwIjoxNjU3NTc2MDIwfQ.dGm1bmFNXbF2XylqnsJe8ylVYvWOKwnz4x9MkL5TJi4", "locked": false, "deleted": false, "lastname": "LANESE", "notified": false, "password": "$2a$10$B71UfswJ91voB8GGErHdfeScWJUVasQuOU/1Sc/vLFYLbhZpH/zzq", "createdAt": "2022-07-04T21:47:00.856Z", "firstname": "NICK A", "phoneNumber": "9735256541", "profilePick": "Default", "signUpToken": "6j4j31Rns7", "mutedListIds": [], "autoPayEnabled": false, "stripeCustomerId": null, "subscriptionToken": "Free", "resetPasswordToken": null, "subscriptionEndDate": "Free-Version", "subscriptionStartDate": "Free-Version", "resetPasswordTokenExpiration": null}	f	f	t	537a2943-5caa-4aa9-82fb-7622fee61142
1c1ac792-fa91-4c0c-81fd-da6d5a169480	2022-07-04 21:47:45.473	TEST2 Announcements	{"{\\"id\\": \\"537a2943-5caa-4aa9-82fb-7622fee61142\\", \\"role\\": \\"OWNER\\", \\"email\\": \\"NICK@KI2NGWILLYSTUDIOS.COM\\", \\"token\\": \\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUzN2EyOTQzLTVjYWEtNGFhOS04MmZiLTc2MjJmZWU2MTE0MiIsImlhdCI6MTY1Njk3MTIyMCwiZXhwIjoxNjU3NTc2MDIwfQ.dGm1bmFNXbF2XylqnsJe8ylVYvWOKwnz4x9MkL5TJi4\\", \\"locked\\": false, \\"deleted\\": false, \\"lastname\\": \\"LANESE\\", \\"notified\\": false, \\"password\\": \\"$2a$10$B71UfswJ91voB8GGErHdfeScWJUVasQuOU/1Sc/vLFYLbhZpH/zzq\\", \\"createdAt\\": \\"2022-07-04T21:47:00.856Z\\", \\"firstname\\": \\"NICK A\\", \\"phoneNumber\\": \\"9735256541\\", \\"profilePick\\": \\"Default\\", \\"signUpToken\\": \\"6j4j31Rns7\\", \\"mutedListIds\\": [], \\"autoPayEnabled\\": false, \\"stripeCustomerId\\": null, \\"subscriptionToken\\": \\"Free\\", \\"resetPasswordToken\\": null, \\"subscriptionEndDate\\": \\"Free-Version\\", \\"subscriptionStartDate\\": \\"Free-Version\\", \\"resetPasswordTokenExpiration\\": null}","{\\"id\\": \\"1839b2c6-e508-4155-b872-0c1f8c5a592f\\", \\"role\\": \\"DRIVER\\", \\"dspId\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72\\", \\"email\\": \\"FAKEEMAIL9@GMAIL.COM\\", \\"token\\": null, \\"locked\\": false, \\"shifts\\": [], \\"deleted\\": false, \\"ownerId\\": \\"537a2943-5caa-4aa9-82fb-7622fee61142\\", \\"lastname\\": \\"MITCHELL\\", \\"mutedIds\\": [], \\"notified\\": false, \\"password\\": \\"$2a$10$rypSc/OdSB8AFZAT5DuIYuK/1bHHPmeNeNPFtV/hN1dQZsZAFdMsa\\", \\"createdAt\\": \\"2022-07-04T22:54:28.207Z\\", \\"firstname\\": \\"DONOVAN\\", \\"attendence\\": null, \\"phoneNumber\\": \\"1-877-3137-4-3326\\\\r\\", \\"profilePick\\": \\"Default\\", \\"globallyMuted\\": false, \\"transporterId\\": \\"ABCTEST9\\", \\"dspTransporter\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST9\\", \\"resetPasswordToken\\": null, \\"resetPasswordTokenExpiration\\": null}","{\\"id\\": \\"79be7643-fb08-4501-bd6c-b25235e302ff\\", \\"role\\": \\"DRIVER\\", \\"dspId\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72\\", \\"email\\": \\"FAKEEMAIL5@GMAIL.COM\\", \\"token\\": null, \\"locked\\": false, \\"shifts\\": [], \\"deleted\\": false, \\"ownerId\\": \\"537a2943-5caa-4aa9-82fb-7622fee61142\\", \\"lastname\\": \\"SHULTZ\\", \\"mutedIds\\": [], \\"notified\\": false, \\"password\\": \\"$2a$10$o6go7i89QRrFM7ZRYr7fJOQAQi8Ew85JuCKdWZruOqyhb0.ic5FCC\\", \\"createdAt\\": \\"2022-07-04T23:00:10.737Z\\", \\"firstname\\": \\"JOSH\\", \\"attendence\\": null, \\"phoneNumber\\": \\"877-393-4448\\\\r\\", \\"profilePick\\": \\"Default\\", \\"globallyMuted\\": false, \\"transporterId\\": \\"ABCTEST5\\", \\"dspTransporter\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST5\\", \\"resetPasswordToken\\": null, \\"resetPasswordTokenExpiration\\": null}","{\\"id\\": \\"d7215568-03de-4085-bcaf-b6ee11a13c1b\\", \\"role\\": \\"DRIVER\\", \\"dspId\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72\\", \\"email\\": \\"FAKEEMAIL6@GMAIL.COM\\", \\"token\\": null, \\"locked\\": false, \\"shifts\\": [], \\"deleted\\": false, \\"ownerId\\": \\"537a2943-5caa-4aa9-82fb-7622fee61142\\", \\"lastname\\": \\"MASTERS\\", \\"mutedIds\\": [], \\"notified\\": false, \\"password\\": \\"$2a$10$7525yQRMosVb5/rBIxyOSuu2t0ts5Y7Cdctlb8qBNTR5yH9h7JE0i\\", \\"createdAt\\": \\"2022-07-04T23:00:11.949Z\\", \\"firstname\\": \\"ANTHONY\\", \\"attendence\\": null, \\"phoneNumber\\": \\"877-393-4449\\\\r\\", \\"profilePick\\": \\"Default\\", \\"globallyMuted\\": false, \\"transporterId\\": \\"ABCTEST6\\", \\"dspTransporter\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST6\\", \\"resetPasswordToken\\": null, \\"resetPasswordTokenExpiration\\": null}","{\\"id\\": \\"91fd134d-f4ad-4d06-8c3e-1fc5726593a2\\", \\"role\\": \\"DRIVER\\", \\"dspId\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72\\", \\"email\\": \\"FAKEEMAIL7@GMAIL.COM\\", \\"token\\": null, \\"locked\\": false, \\"shifts\\": [], \\"deleted\\": false, \\"ownerId\\": \\"537a2943-5caa-4aa9-82fb-7622fee61142\\", \\"lastname\\": \\"DERULO\\", \\"mutedIds\\": [], \\"notified\\": false, \\"password\\": \\"$2a$10$6TCZH9yoU4QZVeEmjgOZcOfzOQez0.wWt2J8BGLwykhmpehWDVve6\\", \\"createdAt\\": \\"2022-07-04T23:00:13.156Z\\", \\"firstname\\": \\"JASON\\", \\"attendence\\": null, \\"phoneNumber\\": \\"877-393-4450\\\\r\\", \\"profilePick\\": \\"Default\\", \\"globallyMuted\\": false, \\"transporterId\\": \\"ABCTEST7\\", \\"dspTransporter\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST7\\", \\"resetPasswordToken\\": null, \\"resetPasswordTokenExpiration\\": null}","{\\"id\\": \\"25ffaf80-f1c0-4b2c-97b8-b694140b902b\\", \\"role\\": \\"DRIVER\\", \\"dspId\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72\\", \\"email\\": \\"FAKEEMAIL8@GMAIL.COM\\", \\"token\\": null, \\"locked\\": false, \\"shifts\\": [], \\"deleted\\": false, \\"ownerId\\": \\"537a2943-5caa-4aa9-82fb-7622fee61142\\", \\"lastname\\": \\"PRICE\\", \\"mutedIds\\": [], \\"notified\\": false, \\"password\\": \\"$2a$10$fnOQVLadusWrm7UxbZuACuVh6Fx9YksAOWGycLYkW5eYxE9b68p2K\\", \\"createdAt\\": \\"2022-07-04T23:00:14.354Z\\", \\"firstname\\": \\"MARK\\", \\"attendence\\": null, \\"phoneNumber\\": \\"877-393-4451\\\\r\\", \\"profilePick\\": \\"Default\\", \\"globallyMuted\\": false, \\"transporterId\\": \\"ABCTEST8\\", \\"dspTransporter\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST8\\", \\"resetPasswordToken\\": null, \\"resetPasswordTokenExpiration\\": null}","{\\"id\\": \\"f9aa82e5-ac2b-40ec-8fbb-625c72800a68\\", \\"role\\": \\"DRIVER\\", \\"dspId\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72\\", \\"email\\": \\"FAKEEMAIL10@GMAIL.COM\\", \\"token\\": null, \\"locked\\": false, \\"shifts\\": [], \\"deleted\\": false, \\"ownerId\\": \\"537a2943-5caa-4aa9-82fb-7622fee61142\\", \\"lastname\\": \\"JOHNSON\\", \\"mutedIds\\": [], \\"notified\\": false, \\"password\\": \\"$2a$10$/sNHAPihWliVaZ.IFukfKenDkCgKtfsIqQbhjC2IhQ7IryMFqvs12\\", \\"createdAt\\": \\"2022-07-04T23:00:16.782Z\\", \\"firstname\\": \\"JAMES\\", \\"attendence\\": null, \\"phoneNumber\\": \\"1-877-3137-4-3327\\\\r\\", \\"profilePick\\": \\"Default\\", \\"globallyMuted\\": false, \\"transporterId\\": \\"ABCTEST10\\", \\"dspTransporter\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST10\\", \\"resetPasswordToken\\": null, \\"resetPasswordTokenExpiration\\": null}","{\\"id\\": \\"3163e4af-9a11-48bd-973a-70003388c244\\", \\"role\\": \\"DRIVER\\", \\"dspId\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72\\", \\"email\\": \\"FAKEEMAIL11@GMAIL.COM\\", \\"token\\": null, \\"locked\\": false, \\"shifts\\": [], \\"deleted\\": false, \\"ownerId\\": \\"537a2943-5caa-4aa9-82fb-7622fee61142\\", \\"lastname\\": \\"PATTERSON\\", \\"mutedIds\\": [], \\"notified\\": false, \\"password\\": \\"$2a$10$8we31VdqUi5N8LdChpADQ.BH8pSrI0HSeju6bxGJ.RnlVV12jJbcq\\", \\"createdAt\\": \\"2022-07-04T23:00:18.061Z\\", \\"firstname\\": \\"PATRICK\\", \\"attendence\\": null, \\"phoneNumber\\": \\"1-877-3137-4-3328\\\\r\\", \\"profilePick\\": \\"Default\\", \\"globallyMuted\\": false, \\"transporterId\\": \\"ABCTEST11\\", \\"dspTransporter\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST11\\", \\"resetPasswordToken\\": null, \\"resetPasswordTokenExpiration\\": null}","{\\"id\\": \\"13b37a67-7d3e-4dff-9cfe-22f8aca919d3\\", \\"role\\": \\"DRIVER\\", \\"dspId\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72\\", \\"email\\": \\"FAKEEMAIL12@GMAIL.COM\\", \\"token\\": null, \\"locked\\": false, \\"shifts\\": [], \\"deleted\\": false, \\"ownerId\\": \\"537a2943-5caa-4aa9-82fb-7622fee61142\\", \\"lastname\\": \\"BLUTH\\", \\"mutedIds\\": [], \\"notified\\": false, \\"password\\": \\"$2a$10$JX/nIhV8a3DnqY0csuzCL.G/1NcNSPpElQpfkBFk3QKTfr1CO42RS\\", \\"createdAt\\": \\"2022-07-04T23:00:19.212Z\\", \\"firstname\\": \\"DONNA\\", \\"attendence\\": null, \\"phoneNumber\\": \\"1-877-3137-4-3329\\\\r\\", \\"profilePick\\": \\"Default\\", \\"globallyMuted\\": false, \\"transporterId\\": \\"ABCTEST12\\", \\"dspTransporter\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST12\\", \\"resetPasswordToken\\": null, \\"resetPasswordTokenExpiration\\": null}","{\\"id\\": \\"a0e7c9bb-b5df-4f00-90a3-2f6faba9bb5f\\", \\"role\\": \\"DRIVER\\", \\"dspId\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72\\", \\"email\\": \\"FAKEEMAIL13@GMAIL.COM\\", \\"token\\": null, \\"locked\\": false, \\"shifts\\": [], \\"deleted\\": false, \\"ownerId\\": \\"537a2943-5caa-4aa9-82fb-7622fee61142\\", \\"lastname\\": \\"JR\\", \\"mutedIds\\": [], \\"notified\\": false, \\"password\\": \\"$2a$10$zQMMmnOk8R3xHROyVNlYD.yRz2eXuVMcg3DOOme2m7aHGiezzk0Bq\\", \\"createdAt\\": \\"2022-07-04T23:00:20.420Z\\", \\"firstname\\": \\"DANIEL\\", \\"attendence\\": null, \\"phoneNumber\\": \\"1-877-3137-4-3330\\\\r\\", \\"profilePick\\": \\"Default\\", \\"globallyMuted\\": false, \\"transporterId\\": \\"ABCTEST13\\", \\"dspTransporter\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST13\\", \\"resetPasswordToken\\": null, \\"resetPasswordTokenExpiration\\": null}","{\\"id\\": \\"13e21746-dcfd-4548-9ac0-c5bb185d729f\\", \\"role\\": \\"DRIVER\\", \\"dspId\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72\\", \\"email\\": \\"FAKEEMAIL14@GMAIL.COM\\", \\"token\\": null, \\"locked\\": false, \\"shifts\\": [], \\"deleted\\": false, \\"ownerId\\": \\"537a2943-5caa-4aa9-82fb-7622fee61142\\", \\"lastname\\": \\"LLOYD\\", \\"mutedIds\\": [], \\"notified\\": false, \\"password\\": \\"$2a$10$eSCpEUdFWvr83ifvombmfOO6AOGA.JCdoua0GhhnRvwKUc8YtPSgu\\", \\"createdAt\\": \\"2022-07-04T23:00:21.627Z\\", \\"firstname\\": \\"JIMMY\\", \\"attendence\\": null, \\"phoneNumber\\": \\"1-877-3137-4-3331\\\\r\\", \\"profilePick\\": \\"Default\\", \\"globallyMuted\\": false, \\"transporterId\\": \\"ABCTEST14\\", \\"dspTransporter\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST14\\", \\"resetPasswordToken\\": null, \\"resetPasswordTokenExpiration\\": null}","{\\"id\\": \\"408f0f0b-c44b-4805-bba6-e55e849f9810\\", \\"role\\": \\"DRIVER\\", \\"dspId\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72\\", \\"email\\": \\"FAKEEMAIL15@GMAIL.COM\\", \\"token\\": null, \\"locked\\": false, \\"shifts\\": [], \\"deleted\\": false, \\"ownerId\\": \\"537a2943-5caa-4aa9-82fb-7622fee61142\\", \\"lastname\\": \\"ADEBAYO\\", \\"mutedIds\\": [], \\"notified\\": false, \\"password\\": \\"$2a$10$1W4nnYYc0jx3roytKkonY.4XXp3bKFQlTlaVgbtVTEPRQpfy87DJ2\\", \\"createdAt\\": \\"2022-07-04T23:00:22.853Z\\", \\"firstname\\": \\"EDRICE\\", \\"attendence\\": null, \\"phoneNumber\\": \\"1-877-3137-4-3332\\\\r\\", \\"profilePick\\": \\"Default\\", \\"globallyMuted\\": false, \\"transporterId\\": \\"ABCTEST15\\", \\"dspTransporter\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST15\\", \\"resetPasswordToken\\": null, \\"resetPasswordTokenExpiration\\": null}","{\\"id\\": \\"7249e92f-22aa-4433-a04f-8e0a9d925f92\\", \\"role\\": \\"DRIVER\\", \\"dspId\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72\\", \\"email\\": \\"FAKEEMAIL16@GMAIL.COM\\", \\"token\\": null, \\"locked\\": false, \\"shifts\\": [], \\"deleted\\": false, \\"ownerId\\": \\"537a2943-5caa-4aa9-82fb-7622fee61142\\", \\"lastname\\": \\"ANDERSON\\", \\"mutedIds\\": [], \\"notified\\": false, \\"password\\": \\"$2a$10$dSDZSqS.7wg7M4jaGwpDquE2dcZJjRQk74FUQGcjwcH0crnuuhRJu\\", \\"createdAt\\": \\"2022-07-04T23:00:24.045Z\\", \\"firstname\\": \\"CHRIS\\", \\"attendence\\": null, \\"phoneNumber\\": \\"1-877-3137-4-3333\\\\r\\", \\"profilePick\\": \\"Default\\", \\"globallyMuted\\": false, \\"transporterId\\": \\"ABCTEST16\\", \\"dspTransporter\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST16\\", \\"resetPasswordToken\\": null, \\"resetPasswordTokenExpiration\\": null}","{\\"id\\": \\"172cee9d-8fe3-46ea-9da4-0f0205964f6f\\", \\"role\\": \\"DRIVER\\", \\"dspId\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72\\", \\"email\\": \\"FAKEEMAIL17@GMAIL.COM\\", \\"token\\": null, \\"locked\\": false, \\"shifts\\": [], \\"deleted\\": false, \\"ownerId\\": \\"537a2943-5caa-4aa9-82fb-7622fee61142\\", \\"lastname\\": \\"BLUTH\\", \\"mutedIds\\": [], \\"notified\\": false, \\"password\\": \\"$2a$10$RCB.iuMtnKhetLa0q8XoQ.4erISAqzmcxS76I19e6UiEWIPne1f5.\\", \\"createdAt\\": \\"2022-07-04T23:00:25.257Z\\", \\"firstname\\": \\"MICHAEL\\", \\"attendence\\": null, \\"phoneNumber\\": \\"1-877-3137-4-3334\\\\r\\", \\"profilePick\\": \\"Default\\", \\"globallyMuted\\": false, \\"transporterId\\": \\"ABCTEST17\\", \\"dspTransporter\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST17\\", \\"resetPasswordToken\\": null, \\"resetPasswordTokenExpiration\\": null}","{\\"id\\": \\"3508da70-541f-45e0-b148-10d8351d48f0\\", \\"role\\": \\"DRIVER\\", \\"dspId\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72\\", \\"email\\": \\"FAKEEMAIL18@GMAIL.COM\\", \\"token\\": null, \\"locked\\": false, \\"shifts\\": [], \\"deleted\\": false, \\"ownerId\\": \\"537a2943-5caa-4aa9-82fb-7622fee61142\\", \\"lastname\\": \\"BYRDE\\", \\"mutedIds\\": [], \\"notified\\": false, \\"password\\": \\"$2a$10$V5ZbD5L.tGAQTfUJVU9Je.ADFLngh7USOzifcfjAEPED3jCuhUR06\\", \\"createdAt\\": \\"2022-07-04T23:00:26.471Z\\", \\"firstname\\": \\"MARTY\\", \\"attendence\\": null, \\"phoneNumber\\": \\"1-877-3137-4-3335\\\\r\\", \\"profilePick\\": \\"Default\\", \\"globallyMuted\\": false, \\"transporterId\\": \\"ABCTEST18\\", \\"dspTransporter\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST18\\", \\"resetPasswordToken\\": null, \\"resetPasswordTokenExpiration\\": null}","{\\"id\\": \\"a7bcc3ca-27e8-458c-95bd-04643923ab47\\", \\"role\\": \\"DRIVER\\", \\"dspId\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72\\", \\"email\\": \\"FAKEEMAIL19@GMAIL.COM\\", \\"token\\": null, \\"locked\\": false, \\"shifts\\": [], \\"deleted\\": false, \\"ownerId\\": \\"537a2943-5caa-4aa9-82fb-7622fee61142\\", \\"lastname\\": \\"KLUM\\", \\"mutedIds\\": [], \\"notified\\": false, \\"password\\": \\"$2a$10$Fa9jvU5u2vbSgivgZlGXUOyTUN8rZSkDWRXmQgO0qkk1xnQrX3RX6\\", \\"createdAt\\": \\"2022-07-04T23:00:27.675Z\\", \\"firstname\\": \\"HEIDI\\", \\"attendence\\": null, \\"phoneNumber\\": \\"1-877-3137-4-3336\\\\r\\", \\"profilePick\\": \\"Default\\", \\"globallyMuted\\": false, \\"transporterId\\": \\"ABCTEST19\\", \\"dspTransporter\\": \\"42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST19\\", \\"resetPasswordToken\\": null, \\"resetPasswordTokenExpiration\\": null}"}	{}	{"id": "537a2943-5caa-4aa9-82fb-7622fee61142", "role": "OWNER", "email": "NICK@KI2NGWILLYSTUDIOS.COM", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUzN2EyOTQzLTVjYWEtNGFhOS04MmZiLTc2MjJmZWU2MTE0MiIsImlhdCI6MTY1Njk3MTIyMCwiZXhwIjoxNjU3NTc2MDIwfQ.dGm1bmFNXbF2XylqnsJe8ylVYvWOKwnz4x9MkL5TJi4", "locked": false, "deleted": false, "lastname": "LANESE", "notified": false, "password": "$2a$10$B71UfswJ91voB8GGErHdfeScWJUVasQuOU/1Sc/vLFYLbhZpH/zzq", "createdAt": "2022-07-04T21:47:00.856Z", "firstname": "NICK A", "phoneNumber": "9735256541", "profilePick": "Default", "signUpToken": "6j4j31Rns7", "mutedListIds": [], "autoPayEnabled": false, "stripeCustomerId": null, "subscriptionToken": "Free", "resetPasswordToken": null, "subscriptionEndDate": "Free-Version", "subscriptionStartDate": "Free-Version", "resetPasswordTokenExpiration": null}	t	t	t	537a2943-5caa-4aa9-82fb-7622fee61142
\.


--
-- Data for Name: CollisionAccident; Type: TABLE DATA; Schema: public; Owner: nick
--

COPY public."CollisionAccident" (id, specific_pictures, contact_info, extra_info, collision_report, "accidentId") FROM stdin;
\.


--
-- Data for Name: Device; Type: TABLE DATA; Schema: public; Owner: nick
--

COPY public."Device" (id, "createdAt", number, name, type, "deviceIndex", "driverId", "dspId") FROM stdin;
\.


--
-- Data for Name: Driver; Type: TABLE DATA; Schema: public; Owner: nick
--

COPY public."Driver" (id, "createdAt", role, token, firstname, lastname, email, "phoneNumber", password, "profilePick", shifts, "transporterId", "globallyMuted", "mutedIds", locked, deleted, attendence, notified, "resetPasswordToken", "resetPasswordTokenExpiration", "ownerId", "dspId", "dspTransporter") FROM stdin;
78537f20-48ba-4c4a-840c-6f6a78d1da05	2022-07-02 15:48:16.158	DRIVER	\N	ADAM	SPARREY	FAKEEMAIL1@GMAIL.COM	973-525-5672\r	$2a$10$1mzkNQJRJT4V95mKfq4H9.oNbdFckU9587NNzfb8ks/qR0.HbAKZC	"Default"	\N	ABCTEST1	f	\N	f	f	\N	f	\N	\N	872c6504-3ea4-4c7c-97a3-c9a71679c8d9	2529f1d1-d5f4-4c28-bf9a-8eef3f39624d	2529f1d1-d5f4-4c28-bf9a-8eef3f39624dABCTEST1
a584a6e1-cf0c-41b4-8449-877e007d87fd	2022-07-02 18:41:28.245	DRIVER	\N	NICK	LANESE	NLANESE21@GMAIL.COM	877-393-4445\r	$2a$10$L3jX8ImA2EqNI4a56w9S7uA96R47rOFAKq80tkyEYqkqELPpmGuLK	"Default"	\N	A13FE7UI9NTRCX	f	\N	f	f	\N	f	\N	\N	872c6504-3ea4-4c7c-97a3-c9a71679c8d9	2529f1d1-d5f4-4c28-bf9a-8eef3f39624d	2529f1d1-d5f4-4c28-bf9a-8eef3f39624dA13FE7UI9NTRCX
c14853a6-9be5-4e10-b09f-55e00223304f	2022-07-02 18:50:52.02	DRIVER	\N	DANIEL	STITT	FAKEEMAIL3@GMAIL.COM	877-393-4446\r	$2a$10$NQswkWJORnmXryOBMhiFkOD9WleCUF/72EQep2wQm1JnoqkbrMlxa	"Default"	\N	ABCTEST3	f	\N	f	f	\N	f	\N	\N	872c6504-3ea4-4c7c-97a3-c9a71679c8d9	2529f1d1-d5f4-4c28-bf9a-8eef3f39624d	2529f1d1-d5f4-4c28-bf9a-8eef3f39624dABCTEST3
f07b3478-d42c-4888-8da3-177e6c4a9752	2022-07-02 18:51:09.276	DRIVER	\N	RICK	SANCHEZZ	FAKEEMAIL20@GMAIL.COM	1-877-3137-4-3337	$2a$10$PTvoUDTsSsMQh2Or3m/w0uMS1rPOVlImP4GoMJYXqrZAD3Z2BzIAe	"Default"	\N	ABCTEST20	f	\N	f	f	\N	f	\N	\N	872c6504-3ea4-4c7c-97a3-c9a71679c8d9	2529f1d1-d5f4-4c28-bf9a-8eef3f39624d	2529f1d1-d5f4-4c28-bf9a-8eef3f39624dABCTEST20
db42edeb-b7fd-4a89-9b83-c7890933a89f	2022-07-02 18:54:53.959	DRIVER	\N	BETH	HAMMOND	FAKEEMAIL4@GMAIL.COM	877-393-4447\r	$2a$10$UonWcDuyWDa1G9kbh7aKlubJxu5c/ckTjvT2S6EBe.kIrd3hPIf92	"Default"	\N	ABCTEST4	f	\N	f	f	\N	f	\N	\N	872c6504-3ea4-4c7c-97a3-c9a71679c8d9	2529f1d1-d5f4-4c28-bf9a-8eef3f39624d	2529f1d1-d5f4-4c28-bf9a-8eef3f39624dABCTEST4
1839b2c6-e508-4155-b872-0c1f8c5a592f	2022-07-04 22:54:28.207	DRIVER	\N	DONOVAN	MITCHELL	FAKEEMAIL9@GMAIL.COM	1-877-3137-4-3326\r	$2a$10$rypSc/OdSB8AFZAT5DuIYuK/1bHHPmeNeNPFtV/hN1dQZsZAFdMsa	"Default"	\N	ABCTEST9	f	\N	f	f	\N	f	\N	\N	537a2943-5caa-4aa9-82fb-7622fee61142	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST9
79be7643-fb08-4501-bd6c-b25235e302ff	2022-07-04 23:00:10.737	DRIVER	\N	JOSH	SHULTZ	FAKEEMAIL5@GMAIL.COM	877-393-4448\r	$2a$10$o6go7i89QRrFM7ZRYr7fJOQAQi8Ew85JuCKdWZruOqyhb0.ic5FCC	"Default"	\N	ABCTEST5	f	\N	f	f	\N	f	\N	\N	537a2943-5caa-4aa9-82fb-7622fee61142	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST5
d7215568-03de-4085-bcaf-b6ee11a13c1b	2022-07-04 23:00:11.949	DRIVER	\N	ANTHONY	MASTERS	FAKEEMAIL6@GMAIL.COM	877-393-4449\r	$2a$10$7525yQRMosVb5/rBIxyOSuu2t0ts5Y7Cdctlb8qBNTR5yH9h7JE0i	"Default"	\N	ABCTEST6	f	\N	f	f	\N	f	\N	\N	537a2943-5caa-4aa9-82fb-7622fee61142	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST6
91fd134d-f4ad-4d06-8c3e-1fc5726593a2	2022-07-04 23:00:13.156	DRIVER	\N	JASON	DERULO	FAKEEMAIL7@GMAIL.COM	877-393-4450\r	$2a$10$6TCZH9yoU4QZVeEmjgOZcOfzOQez0.wWt2J8BGLwykhmpehWDVve6	"Default"	\N	ABCTEST7	f	\N	f	f	\N	f	\N	\N	537a2943-5caa-4aa9-82fb-7622fee61142	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST7
25ffaf80-f1c0-4b2c-97b8-b694140b902b	2022-07-04 23:00:14.354	DRIVER	\N	MARK	PRICE	FAKEEMAIL8@GMAIL.COM	877-393-4451\r	$2a$10$fnOQVLadusWrm7UxbZuACuVh6Fx9YksAOWGycLYkW5eYxE9b68p2K	"Default"	\N	ABCTEST8	f	\N	f	f	\N	f	\N	\N	537a2943-5caa-4aa9-82fb-7622fee61142	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST8
f9aa82e5-ac2b-40ec-8fbb-625c72800a68	2022-07-04 23:00:16.782	DRIVER	\N	JAMES	JOHNSON	FAKEEMAIL10@GMAIL.COM	1-877-3137-4-3327\r	$2a$10$/sNHAPihWliVaZ.IFukfKenDkCgKtfsIqQbhjC2IhQ7IryMFqvs12	"Default"	\N	ABCTEST10	f	\N	f	f	\N	f	\N	\N	537a2943-5caa-4aa9-82fb-7622fee61142	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST10
3163e4af-9a11-48bd-973a-70003388c244	2022-07-04 23:00:18.061	DRIVER	\N	PATRICK	PATTERSON	FAKEEMAIL11@GMAIL.COM	1-877-3137-4-3328\r	$2a$10$8we31VdqUi5N8LdChpADQ.BH8pSrI0HSeju6bxGJ.RnlVV12jJbcq	"Default"	\N	ABCTEST11	f	\N	f	f	\N	f	\N	\N	537a2943-5caa-4aa9-82fb-7622fee61142	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST11
13b37a67-7d3e-4dff-9cfe-22f8aca919d3	2022-07-04 23:00:19.212	DRIVER	\N	DONNA	BLUTH	FAKEEMAIL12@GMAIL.COM	1-877-3137-4-3329\r	$2a$10$JX/nIhV8a3DnqY0csuzCL.G/1NcNSPpElQpfkBFk3QKTfr1CO42RS	"Default"	\N	ABCTEST12	f	\N	f	f	\N	f	\N	\N	537a2943-5caa-4aa9-82fb-7622fee61142	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST12
a0e7c9bb-b5df-4f00-90a3-2f6faba9bb5f	2022-07-04 23:00:20.42	DRIVER	\N	DANIEL	JR	FAKEEMAIL13@GMAIL.COM	1-877-3137-4-3330\r	$2a$10$zQMMmnOk8R3xHROyVNlYD.yRz2eXuVMcg3DOOme2m7aHGiezzk0Bq	"Default"	\N	ABCTEST13	f	\N	f	f	\N	f	\N	\N	537a2943-5caa-4aa9-82fb-7622fee61142	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST13
13e21746-dcfd-4548-9ac0-c5bb185d729f	2022-07-04 23:00:21.627	DRIVER	\N	JIMMY	LLOYD	FAKEEMAIL14@GMAIL.COM	1-877-3137-4-3331\r	$2a$10$eSCpEUdFWvr83ifvombmfOO6AOGA.JCdoua0GhhnRvwKUc8YtPSgu	"Default"	\N	ABCTEST14	f	\N	f	f	\N	f	\N	\N	537a2943-5caa-4aa9-82fb-7622fee61142	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST14
408f0f0b-c44b-4805-bba6-e55e849f9810	2022-07-04 23:00:22.853	DRIVER	\N	EDRICE	ADEBAYO	FAKEEMAIL15@GMAIL.COM	1-877-3137-4-3332\r	$2a$10$1W4nnYYc0jx3roytKkonY.4XXp3bKFQlTlaVgbtVTEPRQpfy87DJ2	"Default"	\N	ABCTEST15	f	\N	f	f	\N	f	\N	\N	537a2943-5caa-4aa9-82fb-7622fee61142	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST15
7249e92f-22aa-4433-a04f-8e0a9d925f92	2022-07-04 23:00:24.045	DRIVER	\N	CHRIS	ANDERSON	FAKEEMAIL16@GMAIL.COM	1-877-3137-4-3333\r	$2a$10$dSDZSqS.7wg7M4jaGwpDquE2dcZJjRQk74FUQGcjwcH0crnuuhRJu	"Default"	\N	ABCTEST16	f	\N	f	f	\N	f	\N	\N	537a2943-5caa-4aa9-82fb-7622fee61142	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST16
172cee9d-8fe3-46ea-9da4-0f0205964f6f	2022-07-04 23:00:25.257	DRIVER	\N	MICHAEL	BLUTH	FAKEEMAIL17@GMAIL.COM	1-877-3137-4-3334\r	$2a$10$RCB.iuMtnKhetLa0q8XoQ.4erISAqzmcxS76I19e6UiEWIPne1f5.	"Default"	\N	ABCTEST17	f	\N	f	f	\N	f	\N	\N	537a2943-5caa-4aa9-82fb-7622fee61142	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST17
3508da70-541f-45e0-b148-10d8351d48f0	2022-07-04 23:00:26.471	DRIVER	\N	MARTY	BYRDE	FAKEEMAIL18@GMAIL.COM	1-877-3137-4-3335\r	$2a$10$V5ZbD5L.tGAQTfUJVU9Je.ADFLngh7USOzifcfjAEPED3jCuhUR06	"Default"	\N	ABCTEST18	f	\N	f	f	\N	f	\N	\N	537a2943-5caa-4aa9-82fb-7622fee61142	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST18
a7bcc3ca-27e8-458c-95bd-04643923ab47	2022-07-04 23:00:27.675	DRIVER	\N	HEIDI	KLUM	FAKEEMAIL19@GMAIL.COM	1-877-3137-4-3336\r	$2a$10$Fa9jvU5u2vbSgivgZlGXUOyTUN8rZSkDWRXmQgO0qkk1xnQrX3RX6	"Default"	\N	ABCTEST19	f	\N	f	f	\N	f	\N	\N	537a2943-5caa-4aa9-82fb-7622fee61142	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72	42d514d0-c81b-4cb2-a5d6-70bf44bc8d72ABCTEST19
\.


--
-- Data for Name: Dsp; Type: TABLE DATA; Schema: public; Owner: nick
--

COPY public."Dsp" (id, "createdAt", name, shortcode, "timeZone", "ficoLimits", "seatbeltLimits", "speedingLimits", "distractionLimits", "followLimits", "signalLimits", "deliveryCompletionRateLimits", "deliveryNotRecievedLimits", "photoOnDeliveryLimits", "topCardLimits", "smallCardLimits", "feedbackNotifications", "autoSend", "allDevices", paid, "accountStanding", "subscriptionToken", "subscriptionStartDate", "subscriptionEndDate", "stripeCustomerId", "autoPayEnabled", "ownerId") FROM stdin;
2529f1d1-d5f4-4c28-bf9a-8eef3f39624d	2022-07-02 15:48:05.353	TEST	TST	EST	{"fair": 770, "good": 800, "fantastic": 830}	{"fair": 15, "good": 10, "fantastic": 5}	{"fair": 10, "good": 6, "fantastic": 3}	{"fair": 10, "good": 6, "fantastic": 3}	{"fair": 10, "good": 6, "fantastic": 3}	{"fair": 15, "good": 10, "fantastic": 5}	{"fair": 90, "good": 95, "fantastic": 98}	{"fair": 3, "good": 2, "fantastic": 0}	{"fair": 90, "good": 95, "fantastic": 98}	5	10	{"fair": "Your performance this past week has been Fair. We commend you on keeping your driving stats with the acceptable thresholds and urge you to make it to Great status next week! Safe Driving!", "great": "Congratulations! You've achieved Great status this past week and we commend you for it! Keep up the great work!", "subpar": "WARNING: Your overall score is below the acceptable threshold. Please be mindful of that fact during this next week and attempt to rectify it."}	{"fair": false, "great": false, "subpar": false}	\N	f	Free	Free	Free-Version	Free-Version	\N	f	872c6504-3ea4-4c7c-97a3-c9a71679c8d9
59088972-912e-4a0c-afd2-185480fc609d	2022-07-02 19:01:26.076	QWERTYU	ERTY	EST	{"fair": 770, "good": 800, "fantastic": 830}	{"fair": 15, "good": 10, "fantastic": 5}	{"fair": 10, "good": 6, "fantastic": 3}	{"fair": 10, "good": 6, "fantastic": 3}	{"fair": 10, "good": 6, "fantastic": 3}	{"fair": 15, "good": 10, "fantastic": 5}	{"fair": 90, "good": 95, "fantastic": 98}	{"fair": 3, "good": 2, "fantastic": 0}	{"fair": 90, "good": 95, "fantastic": 98}	5	10	{"fair": "Your performance this past week has been Fair. We commend you on keeping your driving stats with the acceptable thresholds and urge you to make it to Great status next week! Safe Driving!", "great": "Congratulations! You've achieved Great status this past week and we commend you for it! Keep up the great work!", "subpar": "WARNING: Your overall score is below the acceptable threshold. Please be mindful of that fact during this next week and attempt to rectify it."}	{"fair": false, "great": true, "subpar": true}	\N	f	Free	Free	Free-Version	Free-Version	\N	f	d6f5a900-9972-4027-833c-60847fabdbd2
42d514d0-c81b-4cb2-a5d6-70bf44bc8d72	2022-07-04 21:47:45.447	TEST2	TEST2	CT	{"fair": 770, "good": 800, "fantastic": 830}	{"fair": 15, "good": 10, "fantastic": 5}	{"fair": 10, "good": 6, "fantastic": 3}	{"fair": 10, "good": 6, "fantastic": 3}	{"fair": 10, "good": 6, "fantastic": 3}	{"fair": 15, "good": 10, "fantastic": 5}	{"fair": 90, "good": 95, "fantastic": 98}	{"fair": 3, "good": 2, "fantastic": 0}	{"fair": 90, "good": 95, "fantastic": 98}	5	10	{"fair": "Your performance this past week has been Fair. We commend you on keeping your driving stats with the acceptable thresholds and urge you to make it to Great status next week! Safe Driving!", "great": "Congratulations! You've achieved Great status this past week and we commend you for it! Keep up the great work!", "subpar": "WARNING: Your overall score is below the acceptable threshold. Please be mindful of that fact during this next week and attempt to rectify it."}	{"fair": false, "great": false, "subpar": false}	\N	f	Free	Free	Free-Version	Free-Version	\N	f	537a2943-5caa-4aa9-82fb-7622fee61142
\.


--
-- Data for Name: InjuryAccident; Type: TABLE DATA; Schema: public; Owner: nick
--

COPY public."InjuryAccident" (id, contact_info, extra_info, injured_areas, injury_report, pain_level, specific_pictures, "accidentId", "collisionAccidentId") FROM stdin;
\.


--
-- Data for Name: Manager; Type: TABLE DATA; Schema: public; Owner: nick
--

COPY public."Manager" (id, "createdAt", role, token, firstname, lastname, email, "phoneNumber", password, "profilePick", muted, locked, deleted, notified, "resetPasswordToken", "resetPasswordTokenExpiration", "ownerId", "mutedListIds", "dspId") FROM stdin;
\.


--
-- Data for Name: Messages; Type: TABLE DATA; Schema: public; Owner: nick
--

COPY public."Messages" (id, "createdAt", content, "sentAt", "from", visable, reported, "reportedBy", "chatroomId", "ownerId", "managerId", "driverId") FROM stdin;
\.


--
-- Data for Name: NotifiedMessages; Type: TABLE DATA; Schema: public; Owner: nick
--

COPY public."NotifiedMessages" (id, "createdAt", "sentAt", date, read, "readAt", content, "from", type, "driverId", "dspId") FROM stdin;
\.


--
-- Data for Name: Owner; Type: TABLE DATA; Schema: public; Owner: nick
--

COPY public."Owner" (id, "createdAt", role, token, firstname, lastname, email, "phoneNumber", password, "profilePick", locked, deleted, notified, "resetPasswordToken", "resetPasswordTokenExpiration", "signUpToken", "subscriptionToken", "subscriptionStartDate", "subscriptionEndDate", "stripeCustomerId", "autoPayEnabled", "mutedListIds") FROM stdin;
d6f5a900-9972-4027-833c-60847fabdbd2	2022-07-02 18:58:46.379	OWNER	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ2ZjVhOTAwLTk5NzItNDAyNy04MzNjLTYwODQ3ZmFiZGJkMiIsImlhdCI6MTY1Njc4ODMyNiwiZXhwIjoxNjU3MzkzMTI2fQ.T-xaQ5HsovCReMzlhtvocyyp-UMcZURIcJq3QNSYer8	NICK A	LANESE	NICK@KINSGWILLYSTUDIOS.COM	9735256541	$2a$10$CpHMCYKKzQczE/0sV9nuRu0I5pmIo3gjT7lRO/tOk5aXPttDBEPvy	"Default"	f	f	f	\N	\N	J24dFprLKC	Free	Free-Version	Free-Version	\N	f	\N
872c6504-3ea4-4c7c-97a3-c9a71679c8d9	2022-07-02 15:24:59.234	OWNER	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg3MmM2NTA0LTNlYTQtNGM3Yy05N2EzLWM5YTcxNjc5YzhkOSIsImlhdCI6MTY1Njk1NzEyNCwiZXhwIjoxNjU3NTYxOTI0fQ.LLmiPlBlj_o3dyU6eTnEoJIcvAu5dZvQIgHzsZKKlNg	NICK A	LANESE	NICK@KINGWILLYSTUDIOS.COM	9735256541	$2a$10$2ahJFfxCBOcxAHmY6nRHtuJQtPy3nE.D62Z2ti95yPaDm486HFaKS	"Default"	f	f	f	eyJhbGciOi	-1048569333	M8Nl3Cc492	Free	Free-Version	Free-Version	\N	f	\N
537a2943-5caa-4aa9-82fb-7622fee61142	2022-07-04 21:47:00.856	OWNER	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUzN2EyOTQzLTVjYWEtNGFhOS04MmZiLTc2MjJmZWU2MTE0MiIsImlhdCI6MTY1Njk3MTIyMCwiZXhwIjoxNjU3NTc2MDIwfQ.dGm1bmFNXbF2XylqnsJe8ylVYvWOKwnz4x9MkL5TJi4	NICK A	LANESE	NICK@KI2NGWILLYSTUDIOS.COM	9735256541	$2a$10$B71UfswJ91voB8GGErHdfeScWJUVasQuOU/1Sc/vLFYLbhZpH/zzq	"Default"	f	f	f	\N	\N	6j4j31Rns7	Free	Free-Version	Free-Version	\N	f	\N
\.


--
-- Data for Name: PropertyAccident; Type: TABLE DATA; Schema: public; Owner: nick
--

COPY public."PropertyAccident" (id, contact_info, damage_report, defective_equip, safety_equip, package_report, specific_pictures, extra_info, types_of_damage, "accidentId") FROM stdin;
\.


--
-- Data for Name: SelfInjuryAccident; Type: TABLE DATA; Schema: public; Owner: nick
--

COPY public."SelfInjuryAccident" (id, animal_report, injuries, injury_report, extra_info, specific_pictures, "accidentId") FROM stdin;
\.


--
-- Data for Name: Shift; Type: TABLE DATA; Schema: public; Owner: nick
--

COPY public."Shift" (id, date, "dateDsp", "allDriverShifts", "dspId", "shiftMessage") FROM stdin;
\.


--
-- Data for Name: SuperUser; Type: TABLE DATA; Schema: public; Owner: nick
--

COPY public."SuperUser" (id, "createdAt", role, token, firstname, lastname, email, password, "phoneNumber", "profilePick") FROM stdin;
\.


--
-- Data for Name: WeeklyReport; Type: TABLE DATA; Schema: public; Owner: nick
--

COPY public."WeeklyReport" (id, "createdAt", date, "hadAccident", "feedbackMessage", "feedbackStatus", "feedbackMessageSent", acknowledged, "acknowledgedAt", rank, tier, delivered, "keyFocusArea", fico, "seatbeltOffRate", "speedingEventRate", "distractionsRate", "followingDistanceRate", "signalViolationsRate", "deliveryCompletionRate", "deliveredAndRecieved", "photoOnDelivery", "customerDeliveryFeedback", "attendedDeliveryAccuracy", dnr, "podOpps", "ccOpps", netradyne, "deliveryAssociate", defects, "hasManyAccidents", "belongsToTeam", attendance, productivity, "driverId", "dspId") FROM stdin;
\.


--
-- Data for Name: _ChatroomToDriver; Type: TABLE DATA; Schema: public; Owner: nick
--

COPY public."_ChatroomToDriver" ("A", "B") FROM stdin;
ee41a6eb-00b5-49bf-a247-574d9fcc101f	78537f20-48ba-4c4a-840c-6f6a78d1da05
ee41a6eb-00b5-49bf-a247-574d9fcc101f	c14853a6-9be5-4e10-b09f-55e00223304f
ee41a6eb-00b5-49bf-a247-574d9fcc101f	f07b3478-d42c-4888-8da3-177e6c4a9752
ee41a6eb-00b5-49bf-a247-574d9fcc101f	db42edeb-b7fd-4a89-9b83-c7890933a89f
1c1ac792-fa91-4c0c-81fd-da6d5a169480	1839b2c6-e508-4155-b872-0c1f8c5a592f
1c1ac792-fa91-4c0c-81fd-da6d5a169480	79be7643-fb08-4501-bd6c-b25235e302ff
1c1ac792-fa91-4c0c-81fd-da6d5a169480	d7215568-03de-4085-bcaf-b6ee11a13c1b
1c1ac792-fa91-4c0c-81fd-da6d5a169480	91fd134d-f4ad-4d06-8c3e-1fc5726593a2
1c1ac792-fa91-4c0c-81fd-da6d5a169480	25ffaf80-f1c0-4b2c-97b8-b694140b902b
1c1ac792-fa91-4c0c-81fd-da6d5a169480	f9aa82e5-ac2b-40ec-8fbb-625c72800a68
1c1ac792-fa91-4c0c-81fd-da6d5a169480	3163e4af-9a11-48bd-973a-70003388c244
1c1ac792-fa91-4c0c-81fd-da6d5a169480	13b37a67-7d3e-4dff-9cfe-22f8aca919d3
1c1ac792-fa91-4c0c-81fd-da6d5a169480	a0e7c9bb-b5df-4f00-90a3-2f6faba9bb5f
1c1ac792-fa91-4c0c-81fd-da6d5a169480	13e21746-dcfd-4548-9ac0-c5bb185d729f
1c1ac792-fa91-4c0c-81fd-da6d5a169480	408f0f0b-c44b-4805-bba6-e55e849f9810
1c1ac792-fa91-4c0c-81fd-da6d5a169480	7249e92f-22aa-4433-a04f-8e0a9d925f92
1c1ac792-fa91-4c0c-81fd-da6d5a169480	172cee9d-8fe3-46ea-9da4-0f0205964f6f
1c1ac792-fa91-4c0c-81fd-da6d5a169480	3508da70-541f-45e0-b148-10d8351d48f0
1c1ac792-fa91-4c0c-81fd-da6d5a169480	a7bcc3ca-27e8-458c-95bd-04643923ab47
\.


--
-- Data for Name: _ChatroomToManager; Type: TABLE DATA; Schema: public; Owner: nick
--

COPY public."_ChatroomToManager" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _DriverToManager; Type: TABLE DATA; Schema: public; Owner: nick
--

COPY public."_DriverToManager" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: nick
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
f6a781ae-cbdf-4372-95d9-6df089be9a28	d348f62bd47d9274a0c03a7b80e4c0d3b1da4a219ce657fb1a661e2647524167	2022-07-01 15:59:12.557831-04	20220701195912_restore_test	\N	\N	2022-07-01 15:59:12.360359-04	1
\.


--
-- Name: AnnouncementMessages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nick
--

SELECT pg_catalog.setval('public."AnnouncementMessages_id_seq"', 1, false);


--
-- Name: Device_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nick
--

SELECT pg_catalog.setval('public."Device_id_seq"', 1, false);


--
-- Name: Messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nick
--

SELECT pg_catalog.setval('public."Messages_id_seq"', 1, false);


--
-- Name: NotifiedMessages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nick
--

SELECT pg_catalog.setval('public."NotifiedMessages_id_seq"', 1, false);


--
-- Name: Accident Accident_pkey; Type: CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Accident"
    ADD CONSTRAINT "Accident_pkey" PRIMARY KEY (id);


--
-- Name: AnnouncementMessages AnnouncementMessages_pkey; Type: CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."AnnouncementMessages"
    ADD CONSTRAINT "AnnouncementMessages_pkey" PRIMARY KEY (id);


--
-- Name: Chatroom Chatroom_pkey; Type: CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Chatroom"
    ADD CONSTRAINT "Chatroom_pkey" PRIMARY KEY (id);


--
-- Name: CollisionAccident CollisionAccident_pkey; Type: CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."CollisionAccident"
    ADD CONSTRAINT "CollisionAccident_pkey" PRIMARY KEY (id);


--
-- Name: Device Device_pkey; Type: CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Device"
    ADD CONSTRAINT "Device_pkey" PRIMARY KEY (id);


--
-- Name: Driver Driver_pkey; Type: CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Driver"
    ADD CONSTRAINT "Driver_pkey" PRIMARY KEY (id);


--
-- Name: Dsp Dsp_pkey; Type: CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Dsp"
    ADD CONSTRAINT "Dsp_pkey" PRIMARY KEY (id);


--
-- Name: InjuryAccident InjuryAccident_pkey; Type: CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."InjuryAccident"
    ADD CONSTRAINT "InjuryAccident_pkey" PRIMARY KEY (id);


--
-- Name: Manager Manager_pkey; Type: CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Manager"
    ADD CONSTRAINT "Manager_pkey" PRIMARY KEY (id);


--
-- Name: Messages Messages_pkey; Type: CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_pkey" PRIMARY KEY (id);


--
-- Name: NotifiedMessages NotifiedMessages_pkey; Type: CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."NotifiedMessages"
    ADD CONSTRAINT "NotifiedMessages_pkey" PRIMARY KEY (id);


--
-- Name: Owner Owner_pkey; Type: CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Owner"
    ADD CONSTRAINT "Owner_pkey" PRIMARY KEY (id);


--
-- Name: PropertyAccident PropertyAccident_pkey; Type: CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."PropertyAccident"
    ADD CONSTRAINT "PropertyAccident_pkey" PRIMARY KEY (id);


--
-- Name: SelfInjuryAccident SelfInjuryAccident_pkey; Type: CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."SelfInjuryAccident"
    ADD CONSTRAINT "SelfInjuryAccident_pkey" PRIMARY KEY (id);


--
-- Name: Shift Shift_pkey; Type: CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Shift"
    ADD CONSTRAINT "Shift_pkey" PRIMARY KEY (id);


--
-- Name: SuperUser SuperUser_pkey; Type: CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."SuperUser"
    ADD CONSTRAINT "SuperUser_pkey" PRIMARY KEY (id);


--
-- Name: WeeklyReport WeeklyReport_pkey; Type: CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."WeeklyReport"
    ADD CONSTRAINT "WeeklyReport_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Accident_id_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "Accident_id_key" ON public."Accident" USING btree (id);


--
-- Name: Chatroom_id_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "Chatroom_id_key" ON public."Chatroom" USING btree (id);


--
-- Name: CollisionAccident_id_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "CollisionAccident_id_key" ON public."CollisionAccident" USING btree (id);


--
-- Name: Device_id_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "Device_id_key" ON public."Device" USING btree (id);


--
-- Name: Driver_dspTransporter_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "Driver_dspTransporter_key" ON public."Driver" USING btree ("dspTransporter");


--
-- Name: Driver_email_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "Driver_email_key" ON public."Driver" USING btree (email);


--
-- Name: Driver_id_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "Driver_id_key" ON public."Driver" USING btree (id);


--
-- Name: Driver_resetPasswordToken_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "Driver_resetPasswordToken_key" ON public."Driver" USING btree ("resetPasswordToken");


--
-- Name: Dsp_id_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "Dsp_id_key" ON public."Dsp" USING btree (id);


--
-- Name: Dsp_name_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "Dsp_name_key" ON public."Dsp" USING btree (name);


--
-- Name: Dsp_ownerId_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "Dsp_ownerId_key" ON public."Dsp" USING btree ("ownerId");


--
-- Name: Dsp_shortcode_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "Dsp_shortcode_key" ON public."Dsp" USING btree (shortcode);


--
-- Name: InjuryAccident_id_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "InjuryAccident_id_key" ON public."InjuryAccident" USING btree (id);


--
-- Name: Manager_email_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "Manager_email_key" ON public."Manager" USING btree (email);


--
-- Name: Manager_id_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "Manager_id_key" ON public."Manager" USING btree (id);


--
-- Name: Owner_email_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "Owner_email_key" ON public."Owner" USING btree (email);


--
-- Name: Owner_id_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "Owner_id_key" ON public."Owner" USING btree (id);


--
-- Name: Owner_signUpToken_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "Owner_signUpToken_key" ON public."Owner" USING btree ("signUpToken");


--
-- Name: PropertyAccident_id_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "PropertyAccident_id_key" ON public."PropertyAccident" USING btree (id);


--
-- Name: SelfInjuryAccident_id_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "SelfInjuryAccident_id_key" ON public."SelfInjuryAccident" USING btree (id);


--
-- Name: Shift_dateDsp_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "Shift_dateDsp_key" ON public."Shift" USING btree ("dateDsp");


--
-- Name: Shift_id_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "Shift_id_key" ON public."Shift" USING btree (id);


--
-- Name: SuperUser_email_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "SuperUser_email_key" ON public."SuperUser" USING btree (email);


--
-- Name: SuperUser_id_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "SuperUser_id_key" ON public."SuperUser" USING btree (id);


--
-- Name: WeeklyReport_id_key; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "WeeklyReport_id_key" ON public."WeeklyReport" USING btree (id);


--
-- Name: _ChatroomToDriver_AB_unique; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "_ChatroomToDriver_AB_unique" ON public."_ChatroomToDriver" USING btree ("A", "B");


--
-- Name: _ChatroomToDriver_B_index; Type: INDEX; Schema: public; Owner: nick
--

CREATE INDEX "_ChatroomToDriver_B_index" ON public."_ChatroomToDriver" USING btree ("B");


--
-- Name: _ChatroomToManager_AB_unique; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "_ChatroomToManager_AB_unique" ON public."_ChatroomToManager" USING btree ("A", "B");


--
-- Name: _ChatroomToManager_B_index; Type: INDEX; Schema: public; Owner: nick
--

CREATE INDEX "_ChatroomToManager_B_index" ON public."_ChatroomToManager" USING btree ("B");


--
-- Name: _DriverToManager_AB_unique; Type: INDEX; Schema: public; Owner: nick
--

CREATE UNIQUE INDEX "_DriverToManager_AB_unique" ON public."_DriverToManager" USING btree ("A", "B");


--
-- Name: _DriverToManager_B_index; Type: INDEX; Schema: public; Owner: nick
--

CREATE INDEX "_DriverToManager_B_index" ON public."_DriverToManager" USING btree ("B");


--
-- Name: Accident Accident_driverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Accident"
    ADD CONSTRAINT "Accident_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES public."Driver"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Accident Accident_dspId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Accident"
    ADD CONSTRAINT "Accident_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES public."Dsp"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AnnouncementMessages AnnouncementMessages_chatroomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."AnnouncementMessages"
    ADD CONSTRAINT "AnnouncementMessages_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES public."Chatroom"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AnnouncementMessages AnnouncementMessages_dspId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."AnnouncementMessages"
    ADD CONSTRAINT "AnnouncementMessages_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES public."Dsp"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: AnnouncementMessages AnnouncementMessages_managerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."AnnouncementMessages"
    ADD CONSTRAINT "AnnouncementMessages_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES public."Manager"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: AnnouncementMessages AnnouncementMessages_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."AnnouncementMessages"
    ADD CONSTRAINT "AnnouncementMessages_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."Owner"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Chatroom Chatroom_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Chatroom"
    ADD CONSTRAINT "Chatroom_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."Owner"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CollisionAccident CollisionAccident_accidentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."CollisionAccident"
    ADD CONSTRAINT "CollisionAccident_accidentId_fkey" FOREIGN KEY ("accidentId") REFERENCES public."Accident"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Device Device_driverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Device"
    ADD CONSTRAINT "Device_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES public."Driver"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Device Device_dspId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Device"
    ADD CONSTRAINT "Device_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES public."Dsp"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Driver Driver_dspId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Driver"
    ADD CONSTRAINT "Driver_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES public."Dsp"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Driver Driver_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Driver"
    ADD CONSTRAINT "Driver_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."Owner"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Dsp Dsp_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Dsp"
    ADD CONSTRAINT "Dsp_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."Owner"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: InjuryAccident InjuryAccident_accidentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."InjuryAccident"
    ADD CONSTRAINT "InjuryAccident_accidentId_fkey" FOREIGN KEY ("accidentId") REFERENCES public."Accident"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: InjuryAccident InjuryAccident_collisionAccidentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."InjuryAccident"
    ADD CONSTRAINT "InjuryAccident_collisionAccidentId_fkey" FOREIGN KEY ("collisionAccidentId") REFERENCES public."CollisionAccident"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Manager Manager_dspId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Manager"
    ADD CONSTRAINT "Manager_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES public."Dsp"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Manager Manager_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Manager"
    ADD CONSTRAINT "Manager_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."Owner"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Messages Messages_chatroomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES public."Chatroom"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Messages Messages_driverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES public."Driver"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Messages Messages_managerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES public."Manager"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Messages Messages_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."Owner"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: NotifiedMessages NotifiedMessages_driverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."NotifiedMessages"
    ADD CONSTRAINT "NotifiedMessages_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES public."Driver"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: NotifiedMessages NotifiedMessages_dspId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."NotifiedMessages"
    ADD CONSTRAINT "NotifiedMessages_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES public."Dsp"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PropertyAccident PropertyAccident_accidentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."PropertyAccident"
    ADD CONSTRAINT "PropertyAccident_accidentId_fkey" FOREIGN KEY ("accidentId") REFERENCES public."Accident"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SelfInjuryAccident SelfInjuryAccident_accidentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."SelfInjuryAccident"
    ADD CONSTRAINT "SelfInjuryAccident_accidentId_fkey" FOREIGN KEY ("accidentId") REFERENCES public."Accident"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Shift Shift_dspId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."Shift"
    ADD CONSTRAINT "Shift_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES public."Dsp"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: WeeklyReport WeeklyReport_driverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."WeeklyReport"
    ADD CONSTRAINT "WeeklyReport_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES public."Driver"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: WeeklyReport WeeklyReport_dspId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."WeeklyReport"
    ADD CONSTRAINT "WeeklyReport_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES public."Dsp"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _ChatroomToDriver _ChatroomToDriver_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."_ChatroomToDriver"
    ADD CONSTRAINT "_ChatroomToDriver_A_fkey" FOREIGN KEY ("A") REFERENCES public."Chatroom"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ChatroomToDriver _ChatroomToDriver_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."_ChatroomToDriver"
    ADD CONSTRAINT "_ChatroomToDriver_B_fkey" FOREIGN KEY ("B") REFERENCES public."Driver"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ChatroomToManager _ChatroomToManager_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."_ChatroomToManager"
    ADD CONSTRAINT "_ChatroomToManager_A_fkey" FOREIGN KEY ("A") REFERENCES public."Chatroom"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ChatroomToManager _ChatroomToManager_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."_ChatroomToManager"
    ADD CONSTRAINT "_ChatroomToManager_B_fkey" FOREIGN KEY ("B") REFERENCES public."Manager"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DriverToManager _DriverToManager_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."_DriverToManager"
    ADD CONSTRAINT "_DriverToManager_A_fkey" FOREIGN KEY ("A") REFERENCES public."Driver"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DriverToManager _DriverToManager_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nick
--

ALTER TABLE ONLY public."_DriverToManager"
    ADD CONSTRAINT "_DriverToManager_B_fkey" FOREIGN KEY ("B") REFERENCES public."Manager"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

