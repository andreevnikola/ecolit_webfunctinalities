import logo from "../assets/logo.png";

export default function ErrorPage() {
  return (
    <div className="flex flex-col gap-5 justify-center items-center top-10 py-20 min-h-screen">
      <h1 className="font-bold text-lg">404. Страницата не беше намерена</h1>
      <p className="text-center">
        Не можахме да намерим страницата която търсите. Ако сте убедени във
        валидността на URL адреса, моля свържете се с нас за помощ на
        ecolit@abv.bg
      </p>
    </div>
  );
}
