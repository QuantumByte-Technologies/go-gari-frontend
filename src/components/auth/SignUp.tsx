"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileUp,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo/logo-up.png";

type Step = 1 | 2;

type UploadKey =
  | "nidFront"
  | "nidBack"
  | "dlFront"
  | "dlBack"
  | "passportBio"
  | "idp";

export function SignupForm() {
  const [step, setStep] = useState<Step>(1);
  const [isInternational, setIsInternational] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    agreeTerms: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState<
    Record<UploadKey, string | null>
  >({
    nidFront: null,
    nidBack: null,
    dlFront: null,
    dlBack: null,
    passportBio: null,
    idp: null,
  });

  const requiredKeys = useMemo<UploadKey[]>(() => {
    return isInternational
      ? (["passportBio", "idp"] as const)
      : (["nidFront", "nidBack", "dlFront", "dlBack"] as const);
  }, [isInternational]);

  const personalInfoValid = useMemo(() => {
    return (
      formData.fullName.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.dob.trim() &&
      formData.address.trim()
    );
  }, [formData]);

  const documentsValid = useMemo(() => {
    return requiredKeys.every((k) => uploadedFiles[k]);
  }, [requiredKeys, uploadedFiles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileUpload =
    (fileType: UploadKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        setUploadedFiles((prev) => ({
          ...prev,
          [fileType]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    };

  const handleRemoveFile = (fileType: UploadKey) => {
    setUploadedFiles((prev) => ({ ...prev, [fileType]: null }));
  };

  const goNext = () => step === 1 && setStep(2);
  const goBack = () => step === 2 && setStep(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      formData,
      isInternational,
      uploads: requiredKeys.reduce<Record<string, string | null>>((acc, k) => {
        acc[k] = uploadedFiles[k];
        return acc;
      }, {}),
    };

    console.log("Form submitted:", payload);
  };

  // Smooth “push” transition between steps
  const stepVariants = {
    initial: (direction: number) => ({ opacity: 0, x: direction * 30, y: 8 }),
    animate: { opacity: 1, x: 0, y: 0 },
    exit: (direction: number) => ({ opacity: 0, x: direction * -30, y: -8 }),
  };

  const [prevStep, setPrevStep] = useState<Step>(1);
  const direction = step > prevStep ? 1 : -1;

  // keep prevStep updated
  React.useEffect(() => {
    setPrevStep(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4 sm:py-12">
      {/* Animated background blobs */}
      <AnimatedBackground />

      {/* Local “green primary” theme (no need to change tailwind config) */}
      <div
        className="
          relative z-10
          [--primary:142_71%_45%]
          [--primary-foreground:0_0%_100%]
          [--ring:142_71%_45%]
        "
      >
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur rounded-xl shadow-lg border"
        >
          <Link href={"/"} className="w-full">
            <Image src={logo} alt="logo" className="w-auto h-20 mx-auto my-5" />
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Create Your Account
            </h1>
            <p className="text-muted-foreground">
              Join GO GAARI to start your journey today
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-8 px-8">
            <div className="flex items-center justify-between gap-3">
              <StepPill
                active={step === 1}
                done={step > 1}
                icon={<User className="w-4 h-4" />}
                title="Personal Info"
              />
              <div className="flex-1 h-px bg-border" />
              <StepPill
                active={step === 2}
                done={false}
                icon={<FileText className="w-4 h-4" />}
                title="Document Verification"
              />
            </div>

            {/* progress bar */}
            <div className="mt-4 h-2 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[#65aa36]"
                initial={false}
                animate={{ width: step === 1 ? "50%" : "100%" }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 px-8">
            <AnimatePresence mode="wait" custom={direction}>
              {step === 1 ? (
                <motion.div
                  key="step-1"
                  custom={direction}
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="space-y-6"
                >
                  {/* Personal Information Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <User className="w-5 h-5 text-[#65aa36]" />
                      <h2 className="text-lg font-bold text-foreground">
                        Personal Information
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {/* Full Name */}
                      <div>
                        <Label
                          htmlFor="fullName"
                          className="text-sm font-medium mb-2"
                        >
                          Full Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="fullName"
                            name="fullName"
                            type="text"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="pl-10 h-11"
                          />
                        </div>
                      </div>

                      {/* Email and Phone */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="email"
                            className="text-sm font-medium mb-2"
                          >
                            Email Address
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="pl-10 h-11"
                            />
                          </div>
                        </div>
                        <div>
                          <Label
                            htmlFor="phone"
                            className="text-sm font-medium mb-2"
                          >
                            Phone Number
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              placeholder="+880 1XXX-XXXXXX"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="pl-10 h-11"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Date of Birth and Address */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="dob"
                            className="text-sm font-medium mb-2"
                          >
                            Date of Birth
                          </Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="dob"
                              name="dob"
                              type="date"
                              value={formData.dob}
                              onChange={handleInputChange}
                              className="pl-10 h-11"
                            />
                          </div>
                        </div>
                        <div>
                          <Label
                            htmlFor="address"
                            className="text-sm font-medium mb-2"
                          >
                            Address
                          </Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="address"
                              name="address"
                              type="text"
                              placeholder="Street Address, City"
                              value={formData.address}
                              onChange={handleInputChange}
                              className="pl-10 h-11"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 1 actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Button
                        type="button"
                        onClick={goNext}
                        disabled={!personalInfoValid}
                        className="h-11 bg-[#65aa36] hover:bg-[#65aa36]/90 text-[hsl(var(--primary-foreground))] cursor-pointer"
                      >
                        Next <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step-2"
                  custom={direction}
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="space-y-6"
                >
                  {/* Document Verification Section */}
                  <div className="border-t pt-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#65aa36]" />
                        <h2 className="text-lg font-bold text-foreground">
                          Document Verification
                        </h2>
                      </div>

                      {/* Toggle with animation */}
                      <motion.div
                        layout
                        className="flex items-center gap-3 rounded-full border bg-white px-3 py-2"
                      >
                        <span
                          className={`text-sm font-medium ${
                            !isInternational
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          National
                        </span>

                        <motion.div whileTap={{ scale: 0.95 }}>
                          <Switch
                            checked={isInternational}
                            onCheckedChange={(val) => {
                              setIsInternational(val);

                              // clear uploads when switching type
                              setUploadedFiles((prev) => ({
                                ...prev,
                                nidFront: null,
                                nidBack: null,
                                dlFront: null,
                                dlBack: null,
                                passportBio: null,
                                idp: null,
                              }));
                            }}
                            className="data-[state=checked]:bg-[#65aa36]"
                          />
                        </motion.div>

                        <span
                          className={`text-sm font-medium ${
                            isInternational
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          International
                        </span>
                      </motion.div>
                    </div>

                    <AnimatePresence mode="wait">
                      {/* National (Bangladesh) Documents: 4 files */}
                      {!isInternational ? (
                        <motion.div
                          key="national"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="space-y-6"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DocumentUploadBox
                              label="NID Front Side *"
                              value={uploadedFiles.nidFront}
                              onUpload={handleFileUpload("nidFront")}
                              onRemove={() => handleRemoveFile("nidFront")}
                            />
                            <DocumentUploadBox
                              label="NID Back Side *"
                              value={uploadedFiles.nidBack}
                              onUpload={handleFileUpload("nidBack")}
                              onRemove={() => handleRemoveFile("nidBack")}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DocumentUploadBox
                              label="Driving License Front Side *"
                              value={uploadedFiles.dlFront}
                              onUpload={handleFileUpload("dlFront")}
                              onRemove={() => handleRemoveFile("dlFront")}
                            />
                            <DocumentUploadBox
                              label="Driving License Back Side *"
                              value={uploadedFiles.dlBack}
                              onUpload={handleFileUpload("dlBack")}
                              onRemove={() => handleRemoveFile("dlBack")}
                            />
                          </div>
                        </motion.div>
                      ) : (
                        /* International Documents */
                        <motion.div
                          key="international"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                          <DocumentUploadBox
                            label="Passport Bio Page *"
                            value={uploadedFiles.passportBio}
                            onUpload={handleFileUpload("passportBio")}
                            onRemove={() => handleRemoveFile("passportBio")}
                          />
                          <DocumentUploadBox
                            label="International Driving Permit (IDP) *"
                            value={uploadedFiles.idp}
                            onUpload={handleFileUpload("idp")}
                            onRemove={() => handleRemoveFile("idp")}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Terms & Conditions */}
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-3"
                  >
                    <Checkbox
                      id="terms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          agreeTerms: checked as boolean,
                        }))
                      }
                      className="mt-1 data-[state=checked]:bg-[#65aa36] data-[state=checked]:border-[#65aa36] cursor-pointer"
                    />
                    <Label
                      htmlFor="terms"
                      className="text-sm text-foreground cursor-pointer"
                    >
                      <p>
                        I confirm that the information provided is accurate and
                        I agree to the{" "}
                        <Link
                          href={"#"}
                          className="text-[#65aa36] hover:underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="#"
                          className="text-[#65aa36] hover:underline font-medium"
                        >
                          Privacy Policy
                        </Link>
                      </p>
                    </Label>
                  </motion.div>

                  {/* Step 2 actions */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goBack}
                        className="h-11 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                    </motion.div>

                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        disabled={!documentsValid || !formData.agreeTerms}
                        className="h-11 bg-[#65aa36] hover:bg-[#65aa36]/90 text-[hsl(var(--primary-foreground))] font-semibold cursor-pointer"
                      >
                        Create Account
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Helper */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground pb-4">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="text-[#65aa36] hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function AnimatedBackground() {
  return (
    <div className="absolute inset-0">
      <motion.div
        className="absolute -top-20 -left-24 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl"
        animate={{
          x: [0, 40, -10, 0],
          y: [0, 20, -10, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-40 -right-28 h-80 w-80 rounded-full bg-lime-300/25 blur-3xl"
        animate={{
          x: [0, -40, 10, 0],
          y: [0, -20, 10, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"
        animate={{
          x: [0, 25, -25, 0],
          y: [0, -20, 10, 0],
          scale: [1, 1.08, 0.98, 1],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function StepPill({
  active,
  done,
  icon,
  title,
}: {
  active: boolean;
  done: boolean;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <motion.div
      layout
      className={[
        "flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium transition-colors",
        active
          ? "border-[#65aa36] text-[#65aa36] bg-[#65aa36]/10"
          : "border-border text-muted-foreground bg-white",
      ].join(" ")}
      animate={{ scale: active ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      {done ? <CheckCircle2 className="w-4 h-4 text-[#65aa36]" /> : icon}
      <span className={active ? "text-foreground" : ""}>{title}</span>
    </motion.div>
  );
}

interface DocumentUploadBoxProps {
  label: string;
  value: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

function DocumentUploadBox({
  label,
  value,
  onUpload,
  onRemove,
}: DocumentUploadBoxProps) {
  const uploaded = Boolean(value);

  return (
    <div>
      <Label className="text-sm font-medium mb-3 block text-foreground">
        {label}
      </Label>

      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.995 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="relative border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-muted/50 transition-colors group"
      >
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={onUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label={label}
        />

        {!uploaded ? (
          <div className="py-8">
            <FileUp className="w-12 h-12 text-muted-foreground mx-auto mb-3 group-hover:text-[#65aa36] transition-colors" />
            <p className="text-sm font-medium text-foreground group-hover:text-[#65aa36] transition-colors">
              Click to upload
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG or WEBP
            </p>
          </div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="space-y-3"
          >
            <div className="relative w-full overflow-hidden rounded-md border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value!}
                alt={`${label} preview`}
                className="w-full h-40 object-cover"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-sm font-medium text-[hsl(var(--primary))]">
                  Uploaded
                </p>
                <p className="text-xs text-muted-foreground">
                  Click box to replace
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                className="h-9"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove();
                }}
              >
                Remove
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
