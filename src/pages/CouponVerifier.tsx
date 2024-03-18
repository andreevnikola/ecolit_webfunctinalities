import { useParams } from "react-router-dom";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { IItem } from "../types/item";

export default function CouponVerifier() {
  const { couponId, userId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState<null | IItem>(null);
  const [error, setError] = useState<null | JSX.Element>(null);

  useEffect(() => {
    (async () => {
      const data = await supabase
        .from("items")
        .select(
          `
      id,
      bought_at,
      is_active,
      coupon (
        id,
        title,
        price,
        percent,
        limit,
        store_type
      ),
      user (
        id,
        email,
        full_name,
        avatar_url
      )
    `
        )
        .eq("user", userId)
        .eq("coupon", couponId)
        .returns<IItem[]>();
      setIsLoading(false);

      if (data.error && data.status === 400) {
        setError(
          <p className="text-red-600 font-bold text-xl">Невалиден купон.</p>
        );
        return;
      }

      if (data.error) {
        setError(
          <p className="text-center">
            Нещо се обърка. Моля опитайте пак по-късно!
          </p>
        );
        return;
      }

      setItem(data.data[0]);
    })();
  }, []);

  return (
    <div className="flex flex-col gap-10 justify-center items-center top-10 py-20 px-3 min-h-screen">
      <img src={logo} className="max-w-[100%] w-40" />
      {isLoading && <p className="text-center">Моля изчакайте ...</p>}
      {error && <>{error}</>}
      {!isLoading && !error && (
        <div className="w-full flex rounded border-borderColor border bg-backgroundShade p-3">
          <div className="flex justify-center gap-3 w-full items-center">
            <img src={item!.user.avatar_url} width={30} height={30} />
            <p className="font-bold text-lg ">{item?.user.full_name}</p>
          </div>
          <hr />
        </div>
      )}
    </div>
  );
}
