import mongoose, { Schema } from "mongoose";
import emailVerificationTemplate from "../../mailTemplates/emailVerification.template.js";
import mailSender from "../../utils/mailSender.js";

const otpSchema = new Schema({
   email: {
      type: String,
      required: true,
   },
   otp: {
      type: String,
      required: true,
   },
   expires: {
      type: Date,
      default: Date.now,
      expires: 5 * 60,
   },
});

// Define a function to send emails
async function sendVerificationEmail(email, otp) {

   try {
      const mailResponse = await mailSender(
         email,
         "Verification Email",
         emailVerificationTemplate(otp)
      );
   } catch (error) {
      console.log("Error occurred while sending email: ", error);
      throw error;
   }
}

// Define a post-save hook to send email after the document has been saved
otpSchema.pre("save", async function (next) {

   // Only send an email when a new document is created
   if (this.isNew) {
      await sendVerificationEmail(this.email, this.otp);
   }
   next();
});

export const Otp = mongoose.model("OTP", otpSchema);