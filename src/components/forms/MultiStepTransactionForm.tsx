import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Wrench,
  Package,
  Smartphone,
  Check,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Phone,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const transactionSchema = z
  .object({
    // Step 1: Customer & Device Details
    customerName: z.string().min(1, "Customer name is required"),
    phoneNumber: z.string().min(10, "Valid phone number is required"),
    deviceModel: z.string().min(1, "Device model is required"),
    imeiNumber: z.string().optional(),
    problemDescription: z.string().optional(),

    // Step 2: Repair Info
    repairType: z.string().min(1, "Repair type is required"),
    customRepairType: z.string().optional(),
    repairCost: z.number().min(0, "Cost must be positive"),
    warrantyPeriod: z.number().min(0, "Warranty period must be valid"),
    paymentMethod: z.enum(["cash", "upi", "card"]),
    amountGiven: z.number().min(0, "Amount must be positive"),

    // Step 3: Parts & Supplier Info
    requiresParts: z.boolean(),
    supplierName: z.string().optional(),
    supplierContact: z.string().optional(),
    partsDescription: z.string().optional(),
    partsCost: z.number().min(0).optional(),

    // Step 4: Additional Details
    expectedCompletion: z.string().optional(),
    priority: z.enum(["low", "medium", "high"]),
    notes: z.string().optional(),
    freeGlass: z.boolean(),
  })
  .refine(
    (data) => {
      // If repair type is "others", custom repair type is required
      if (data.repairType === "others" && !data.customRepairType?.trim()) {
        return false;
      }
      return true;
    },
    {
      message: "Custom repair type is required when 'Others' is selected",
      path: ["customRepairType"],
    },
  );

type TransactionFormData = z.infer<typeof transactionSchema>;

const repairTypes = [
  "screen-replacement",
  "battery-replacement",
  "charging-port",
  "speaker-repair",
  "camera-repair",
  "water-damage",
  "software-issue",
  "others",
];

const deviceModels = [
  "iPhone 15 Pro",
  "iPhone 15",
  "iPhone 14 Pro",
  "iPhone 14",
  "iPhone 13",
  "Samsung Galaxy S24",
  "Samsung Galaxy S23",
  "OnePlus 12",
  "OnePlus 11",
  "Google Pixel 8",
  "Google Pixel 7",
  "Xiaomi 14",
  "Realme GT 6",
];

export function MultiStepTransactionForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const { t } = useLanguage();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      requiresParts: false,
      priority: "medium",
      freeGlass: false,
      warrantyPeriod: 30,
    },
  });

  const watchedValues = watch();
  const requiresParts = watch("requiresParts");
  const repairCost = watch("repairCost") || 0;
  const amountGiven = watch("amountGiven") || 0;
  const changeReturned = Math.max(0, amountGiven - repairCost);

  const steps = [
    {
      title: t("customer-details"),
      icon: User,
      description: "Enter customer and device information",
    },
    {
      title: t("repair-info"),
      icon: Wrench,
      description: "Repair details and payment information",
    },
    {
      title: t("parts-supplier"),
      icon: Package,
      description: "Parts required and supplier details",
    },
    {
      title: t("additional-details"),
      icon: Smartphone,
      description: "Final details and status",
    },
  ];

  const nextStep = async () => {
    let fieldsToValidate: (keyof TransactionFormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["customerName", "phoneNumber", "deviceModel"];
        break;
      case 2:
        fieldsToValidate = [
          "repairType",
          "repairCost",
          "paymentMethod",
          "amountGiven",
        ];
        // If "others" is selected, also validate custom repair type
        if (watchedValues.repairType === "others") {
          fieldsToValidate.push("customRepairType");
        }
        break;
      case 3:
        fieldsToValidate = requiresParts
          ? ["supplierName", "supplierContact"]
          : [];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (!isValid) return;

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form
      handleSubmit(onSubmit)();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: TransactionFormData) => {
    // If "others" is selected, use the custom repair type
    const finalData = {
      ...data,
      repairType:
        data.repairType === "others" ? data.customRepairType : data.repairType,
    };

    console.log("Transaction Data:", finalData);
    // Here you would typically send the data to your backend
    alert("Transaction created successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-2">
          {t("new-transaction")}
        </h2>
        <p className="text-muted-foreground text-center">
          Create a new repair transaction with complete details
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center ${
                index < steps.length - 1 ? "flex-1" : ""
              }`}
            >
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                    currentStep > index + 1
                      ? "bg-primary border-primary text-primary-foreground"
                      : currentStep === index + 1
                        ? "border-primary text-primary"
                        : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {currentStep > index + 1 ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    currentStep > index + 1 ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Customer & Device Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">{t("customer-name")} *</Label>
                    <Input
                      id="customerName"
                      placeholder="Enter customer name"
                      {...register("customerName")}
                      className="h-12"
                    />
                    {errors.customerName && (
                      <p className="text-sm text-destructive">
                        {errors.customerName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">{t("phone-number")} *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Enter phone number"
                      {...register("phoneNumber")}
                      className="h-12"
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-destructive">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="deviceModel">{t("device-model")} *</Label>
                    <Select
                      onValueChange={(value) => setValue("deviceModel", value)}
                      defaultValue={watchedValues.deviceModel}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select device model" />
                      </SelectTrigger>
                      <SelectContent>
                        {deviceModels.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.deviceModel && (
                      <p className="text-sm text-destructive">
                        {errors.deviceModel.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imeiNumber">IMEI Number</Label>
                    <Input
                      id="imeiNumber"
                      placeholder="Enter IMEI number"
                      {...register("imeiNumber")}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problemDescription">
                    Problem Description
                  </Label>
                  <Textarea
                    id="problemDescription"
                    placeholder="Describe the device problem"
                    {...register("problemDescription")}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Repair Info */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="repairType">{t("repair-type")} *</Label>
                    <Select
                      onValueChange={(value) => setValue("repairType", value)}
                      defaultValue={watchedValues.repairType}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select repair type" />
                      </SelectTrigger>
                      <SelectContent>
                        {repairTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type === "others" ? "Others (Custom)" : t(type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.repairType && (
                      <p className="text-sm text-destructive">
                        {errors.repairType.message}
                      </p>
                    )}

                    {/* Custom repair type input when "others" is selected */}
                    {watchedValues.repairType === "others" && (
                      <div className="space-y-2 mt-3">
                        <Label htmlFor="customRepairType">
                          Custom Repair Type *
                        </Label>
                        <Input
                          id="customRepairType"
                          placeholder="Enter custom repair type"
                          {...register("customRepairType")}
                          className="h-12"
                        />
                        {errors.customRepairType && (
                          <p className="text-sm text-destructive">
                            {errors.customRepairType.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="repairCost">{t("repair-cost")} *</Label>
                    <Input
                      id="repairCost"
                      type="number"
                      placeholder="0"
                      {...register("repairCost", { valueAsNumber: true })}
                      className="h-12"
                    />
                    {errors.repairCost && (
                      <p className="text-sm text-destructive">
                        {errors.repairCost.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="warrantyPeriod">Warranty (Days)</Label>
                    <Input
                      id="warrantyPeriod"
                      type="number"
                      placeholder="30"
                      {...register("warrantyPeriod", { valueAsNumber: true })}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>{t("payment-method")} *</Label>
                  <RadioGroup
                    onValueChange={(value) =>
                      setValue("paymentMethod", value as any)
                    }
                    defaultValue={watchedValues.paymentMethod}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {["cash", "upi", "card"].map((method) => (
                      <div
                        key={method}
                        className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent"
                      >
                        <RadioGroupItem value={method} id={method} />
                        <Label
                          htmlFor={method}
                          className="flex-1 cursor-pointer"
                        >
                          {t(method)}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.paymentMethod && (
                    <p className="text-sm text-destructive">
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="amountGiven">{t("amount-given")} *</Label>
                    <Input
                      id="amountGiven"
                      type="number"
                      placeholder="0"
                      {...register("amountGiven", { valueAsNumber: true })}
                      className="h-12"
                    />
                    {errors.amountGiven && (
                      <p className="text-sm text-destructive">
                        {errors.amountGiven.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Change to Return</Label>
                    <div className="h-12 px-3 border rounded-md bg-muted flex items-center">
                      <span className="text-lg font-semibold">
                        ₹{changeReturned.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Parts & Supplier Info */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requiresParts"
                    checked={requiresParts}
                    onCheckedChange={(checked) =>
                      setValue("requiresParts", !!checked)
                    }
                  />
                  <Label htmlFor="requiresParts">
                    This repair requires additional parts
                  </Label>
                </div>

                {requiresParts && (
                  <div className="space-y-6 p-4 border rounded-lg bg-muted/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="supplierName">Supplier Name *</Label>
                        <Input
                          id="supplierName"
                          placeholder="Enter supplier name"
                          {...register("supplierName")}
                          className="h-12"
                        />
                        {errors.supplierName && (
                          <p className="text-sm text-destructive">
                            {errors.supplierName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="supplierContact">
                          Supplier Contact *
                        </Label>
                        <Input
                          id="supplierContact"
                          placeholder="Enter contact information"
                          {...register("supplierContact")}
                          className="h-12"
                        />
                        {errors.supplierContact && (
                          <p className="text-sm text-destructive">
                            {errors.supplierContact.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="partsDescription">
                          Parts Description
                        </Label>
                        <Textarea
                          id="partsDescription"
                          placeholder="Describe required parts"
                          {...register("partsDescription")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="partsCost">Parts Cost</Label>
                        <Input
                          id="partsCost"
                          type="number"
                          placeholder="0"
                          {...register("partsCost", { valueAsNumber: true })}
                          className="h-12"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Additional Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="expectedCompletion">
                      Expected Completion
                    </Label>
                    <Input
                      id="expectedCompletion"
                      type="date"
                      {...register("expectedCompletion")}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("priority", value as any)
                      }
                      defaultValue={watchedValues.priority}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes or instructions"
                    {...register("notes")}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="freeGlass"
                    checked={watchedValues.freeGlass}
                    onCheckedChange={(checked) =>
                      setValue("freeGlass", !!checked)
                    }
                  />
                  <Label htmlFor="freeGlass">Include free screen guard</Label>
                </div>

                {/* Transaction Summary */}
                <Card className="bg-muted/20">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Transaction Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Customer
                        </p>
                        <p className="font-medium">
                          {watchedValues.customerName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Device</p>
                        <p className="font-medium">
                          {watchedValues.deviceModel || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Repair Type
                        </p>
                        <p className="font-medium">
                          {watchedValues.repairType === "others"
                            ? watchedValues.customRepairType || "Custom Repair"
                            : t(watchedValues.repairType || "")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Cost</p>
                        <p className="font-medium">
                          ₹{(watchedValues.repairCost || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </span>
            <Button
              type={currentStep === steps.length ? "submit" : "button"}
              onClick={currentStep === steps.length ? undefined : nextStep}
              className="flex items-center gap-2"
            >
              {currentStep === steps.length ? "Create Transaction" : "Next"}
              {currentStep < steps.length && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
