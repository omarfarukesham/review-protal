/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Star, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  createReview,
  getReviewDetails,
  updateReview,
} from "@/Services/Reviews";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { TReview } from "@/types/globals";

export default function ReviewForm() {
  const { data: session } = useSession();
  const path = usePathname();
  const formType = path.split("/")[3].split("-")[0];
  const reviewId = path.split("/")[4];
  const router = useRouter();
  const [currentData, setCurrentData] = useState<Partial<TReview>>({});
  const [loading, setLoading] = useState(formType === "update");

  // State for image file and preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const categories = {
    MOVIE: "Movie",
    TV_SHOW: "TV Show",
    BOOK: "Book",
    ELECTRONICS: "Electronics",
    VEHICLE: "Vehicle",
  };

  // Define form schema with Zod - make fields optional for update form
  const formSchema = z.object({
    title:
      formType === "create"
        ? z.string().min(1, { message: "Title is required" })
        : z.string().optional(),
    category:
      formType === "create"
        ? z.string().min(1, { message: "Please select a category" })
        : z.string().optional(),
    description:
      formType === "create"
        ? z
            .string()
            .min(10, { message: "Review should be at least 10 characters" })
        : z.string().optional(),
    RatingSummary:
      formType === "create"
        ? z.string().min(1, { message: "Please provide a rating" })
        : z.string().optional(),
    markAsPremium: z.boolean().default(false),
  });

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      RatingSummary: "",
      markAsPremium: false,
    },
  });

  // Fetch the current review data if in update mode
  useEffect(() => {
    const fetchCurrentReviewData = async () => {
      try {
        setLoading(true);
        const res = await getReviewDetails(reviewId, formType);
        setCurrentData(res.data);
        // Set form values from current data
        form.reset({
          title: res.data.title || "",
          category: res.data.category || "",
          description: res.data.description || "",
          RatingSummary: res.data.RatingSummary?.toString() || "",
          markAsPremium: res.data.isPremium || false,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching review details:", error);
        toast.error("Failed to load review data");
        setLoading(false);
      }
    };

    if (formType === "update") {
      fetchCurrentReviewData();
    }
  }, [formType, reviewId, form]);
  // Handle image preview
  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setImagePreview(objectUrl);

      // Clean up function to revoke object URL
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [imageFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImageFile(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const loadingId = toast.loading("Submitting...");

    // Only include fields that have values
    const payload = {
      ...(values.title && { title: values.title }),
      ...(values.category && { category: values.category }),
      ...(values.description && { description: values.description }),
      ...(values.RatingSummary && {
        RatingSummary: Number(values.RatingSummary),
      }),
      ...(values.markAsPremium !== undefined && {
        isPremium: values.markAsPremium,
      }),
    };

    // Create FormData object for API submission
    const transformedFormData = new FormData();
    if (imageFile) {
      transformedFormData.append("file", imageFile);
    }
    transformedFormData.append("data", JSON.stringify(payload));

    let result;
    if (formType === "create") {
      result = await createReview(transformedFormData);
    } else {
      result = await updateReview(transformedFormData, reviewId);
    }

    if (result.success) {
      toast.success(result.message, {
        id: loadingId,
      });
      setTimeout(() => {
        router.push(
          `/dashboard/${session?.user.role.toLowerCase()}/my-reviews`
        );
      }, 1000);
    } else {
      toast.error(result.message, {
        id: loadingId,
      });
    }

    // Reset form after submission
    form.reset();
    setImageFile(null);
    setImagePreview(null);
  }

  return (
    <div className="flex flex-col items-center w-full">
      {loading ? (
        <div className="w-full h-64 flex items-center justify-center">
          <p>Loading review data...</p>
        </div>
      ) : (
        <>
          {/* Header Section with Image Upload */}
          <div
            className="w-full relative bg-gray-800 text-white py-16 px-4 text-center"
            style={{
              backgroundImage: imagePreview
                ? `url('${imagePreview}')`
                : currentData.imageUrl
                ? `url('${currentData.imageUrl}')`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "overlay",
            }}
          >
            <div className="z-10 relative">
              <h1 className="text-4xl font-bold mb-4">
                {formType === "create" ? "Submit Your" : "Modify"} Review
              </h1>
              <p className="text-sm mb-8">
                Share your thoughts and help others make informed decisions
                about their purchases.
              </p>

              <div className="max-w-md mx-auto relative">
                {imagePreview || currentData.imageUrl ? (
                  <div className="mb-4 relative">
                    <div className="border-2 border-white border-dashed rounded-lg p-2">
                      <p className="text-sm text-white">
                        {imagePreview ? "New image uploaded" : "Current image"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <Label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-700 bg-opacity-50 hover:bg-gray-600 transition-all"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-200" />
                      <p className="mb-2 text-sm text-gray-200">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-300">
                        PNG, JPG or GIF (MAX. 2MB)
                      </p>
                    </div>
                    <Input
                      id="image-upload"
                      name="imageUrl"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </Label>
                )}
              </div>
            </div>
            {imagePreview && (
              <Button
                size="icon"
                className="absolute top-2 right-2 rounded-full bg-white text-gray-800 hover:bg-gray-100"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Form Section */}
          <Card className="w-full max-w-2xl mx-auto my-8 shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">
                {formType === "create" ? "Submit" : "Modify"} Review
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>
                          Title {formType === "update" && "(Optional)"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              formType === "update" && currentData.title
                                ? currentData.title
                                : "Give your review a title"
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>
                          Category {formType === "update" && "(Optional)"}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={
                            field.value ||
                            (formType === "update" ? currentData.category : "")
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  formType === "update" && currentData.category
                                    ? categories[currentData.category]
                                    : "Select a category"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(categories).map(([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="RatingSummary"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>
                          Rating {formType === "update" && "(Optional)"}
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-8 h-8 cursor-pointer ${
                                  star <=
                                  Number(
                                    field.value ||
                                      (formType === "update"
                                        ? currentData.RatingSummary
                                        : 0)
                                  )
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                onClick={() => field.onChange(star.toString())}
                                onMouseEnter={(e) => {
                                  e.currentTarget.classList.add(
                                    "hover:text-yellow-300"
                                  );
                                }}
                              />
                            ))}
                            {(Number(field.value) > 0 ||
                              (formType === "update" &&
                                currentData.RatingSummary)) && (
                              <span className="ml-2 text-sm text-gray-500">
                                {field.value || currentData.RatingSummary} out
                                of 5
                              </span>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>
                          Review {formType === "update" && "(Optional)"}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={
                              formType === "update" && currentData.description
                                ? currentData.description
                                : "Write your review..."
                            }
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {session?.user.role.toLowerCase() === "admin" && (
                    <FormField
                      control={form.control}
                      name="markAsPremium"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={
                                field.value ||
                                (formType === "update"
                                  ? currentData.isPremium
                                  : false)
                              }
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Mark as Premium</FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Button type="submit" className="w-full md:w-auto">
                    {formType === "create" ? "Publish" : "Update"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
