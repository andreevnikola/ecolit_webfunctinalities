import logo from "../assets/logo.png";

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-10 justify-center items-center top-10 py-20 min-h-screen">
      <img src={logo} className="max-w-[100%] w-40" />
      <p className="text-center">
        Ние в EcoLit предлагаме иновативен начин за рециклиране.
      </p>
    </div>
  );
}
