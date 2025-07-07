import InfoCard from "./components/InfoCard";

export const metadata = {
  title: "Info Management - Aljabr Dashboard",
  description: "Manage social media and contact information for Aljabr",
  keywords: ["aljabr", "info management", "social media", "contact information"],
};

export default function InfoPage() {
  return (
    <div className="grid grid-cols-3 gap-2" dir="ltr">
      <InfoCard type="X_ACCOUNT" label="X(Twitter) Account" />
      <InfoCard type="PHONE_NUMBER" label="Phone Number" />
      <InfoCard type="INSTAGRAM_ACCOUNT" label="Instagram Account" />
    </div>
  );
}
