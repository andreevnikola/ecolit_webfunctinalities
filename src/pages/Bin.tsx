import { Scanner } from "@yudiel/react-qr-scanner";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import { IUser } from "../types/user";
import { supabase } from "../supabase";

const trashToPrizeMapper = new Map<
  "хартия" | "пластмаса" | "метал" | "стъкло" | "органичен отпадък",
  number
>([
  ["метал", 140],
  ["пластмаса", 90],
  ["хартия", 68],
  ["стъкло", 55],
  ["органичен отпадък", 45],
]);

const trashFields: {
  type: "хартия" | "пластмаса" | "метал" | "стъкло" | "органичен отпадък";
  title: string;
  image: string;
}[] = [
  {
    type: "хартия",
    title: "Хартия",
    image: "paper.png",
  },
  {
    type: "метал",
    title: "Метал",
    image: "metal.png",
  },
  {
    type: "стъкло",
    title: "Стъкло",
    image: "glass.png",
  },
  {
    type: "органичен отпадък",
    title: "Органичен отпадък",
    image: "organic.png",
  },
  {
    type: "пластмаса",
    title: "Пластмаса",
    image: "plastic.png",
  },
];

const weightFields = [0.3, 0.5, 1, 1.5];

export default function BinPage() {
  const [trashType, setTrashType] = useState<
    "хартия" | "пластмаса" | "метал" | "стъкло" | "органичен отпадък"
  >("стъкло");
  const [weight, setWeight] = useState<0.3 | 0.5 | 1 | 1.5>(1);

  const [user, setUser] = useState<any | null>(null);
  const [isTimedOut, setIsTimedOut] = useState(false);

  const prize = Math.floor(trashToPrizeMapper.get(trashType)! * weight);

  const scanned = async (text: string, result: any) => {
    if (isTimedOut) return;

    setIsTimedOut(true);
    if (!text.startsWith("EcoLit.Recycle:")) {
      alert("Сканирай QR кода от панела Рециклирай на апликацията.");
      return;
    }
    const userId = text.split(":")[1];
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .returns<any[]>();

    if (error) {
      alert("Нещо се обърка!");
      return;
    }

    setUser(users[0]);
  };

  useEffect(() => {
    if (!user) return;

    (async () => {
      console.log(user.points + prize);
      console.log(user.id);

      const { error } = await supabase
        .from("users")
        .update({ points: user.points + prize })
        .eq("id", user.id);
      if (error) {
        alert("Нещо се обърка!");
        return;
      }
      alert(
        `${user.full_name.split(" ")[0]} беше възнаграден с ${prize} точки!`
      );
    })();
  }, [user]);

  useEffect(() => {
    setTimeout(() => setIsTimedOut(false), 550);
  }, [isTimedOut]);

  return (
    <>
      <div className="flex flex-col gap-10 justify-center items-center top-10 py-20 min-h-screen px-5">
        <img src={logo} className="max-w-[100%] w-24" />
        <h1 className="font-sans font-bold text-5xl text-secondary -mt-10 mb-5">
          Рециклирай
        </h1>

        <div className="flex gap-2.5 flex-col items-center justify-center w-fit">
          <div className="flex gap-2">
            {trashFields.map((trash) => (
              <div
                className="flex flex-col gap-4 bg-backgroundTint rounded-lg border-4 p-3 cursor-pointer transition-all active:bg-accent"
                style={{
                  borderColor: trash.type === trashType ? "#5B7E4E" : "#cbd4d3",
                }}
                onClick={() => setTrashType(trash.type)}
              >
                <img
                  src={require(`../assets/trash/${trash.image}`)}
                  className="h-16"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 w-full">
            {weightFields.map((field: number) => (
              <div
                className="flex items-center w-full justify-center aspect-square flex-col gap-4 bg-backgroundTint rounded-lg border-4 p-3 cursor-pointer transition-all active:bg-accent"
                style={{
                  borderColor: field === weight ? "#5B7E4E" : "#cbd4d3",
                }}
                onClick={() => setWeight(field as any)}
              >
                <p className="font-bold text-2xl -mt-1">{field}</p>
                <p className="-mt-6">кг</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-0.5">
            <p className="font-semibold text-xl text-accent">
              Възнаграждение: <strong>{prize}</strong>
            </p>
            <img src={require("../assets/coin.png")} className="h-4 w-4" />
          </div>
        </div>

        <div className="w-96 max-w-[100%]">
          <Scanner
            onResult={scanned}
            onError={(error) => {
              console.log(error?.message);
              alert("Нещо се обърка, моля опитайте пак по-късно!");
            }}
            options={{
              constraints: {
                facingMode: { exact: "user" },
              },
            }}
          />
          <p className="text-textShade text-sm font-serif text-center">
            Сканирай QR кода от панела <strong>Рециклирай</strong> на
            апликацията.
          </p>
        </div>
      </div>
      {/* <div
        className="absolute top-0 left-0 flex w-full h-full justify-center items-center p-3"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      >
        <div className="max-w-3xl w-full p-6 rounded-lg border-primary border bg-backgroundShade">
          <h3 className="text-xl"></h3>
        </div>
      </div> */}
    </>
  );
}
