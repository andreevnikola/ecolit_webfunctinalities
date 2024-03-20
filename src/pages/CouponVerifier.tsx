import { useParams } from "react-router-dom";
import logo from "../assets/logo.png";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase";
import { IItem } from "../types/item";
import { getTypeDataFromName } from "../utils/typeData";
import { IonIcon } from "@ionic/react";

import coin from "../assets/coin.png";

export default function CouponVerifier() {
  const { couponId, userId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState<null | IItem>(null);
  const [error, setError] = useState<null | JSX.Element>(null);

  const fetch = async () => {
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

    console.log(data);

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

    if (data.data.length < 1) {
      setError(
        <p className="text-red-600 font-bold text-xl">Невалиден купон.</p>
      );
      return;
    }

    const item = data.data.find((item) => item.is_active);

    setItem(item || data.data[0]);
  };

  useEffect(() => {
    fetch();
  }, []);

  const storeTypeData = useMemo(
    () =>
      item
        ? item.coupon.store_type.map((type) => getTypeDataFromName(type))
        : null,
    [item]
  );

  const deactivateCoupon = async () => {
    const { error } = await supabase
      .from("items")
      .update({ is_active: false, used_at: new Date() })
      .eq("id", item!.id);
    if (error) {
      alert("Нещо се обърка! Не можахме да отбележим купона като използван.");
      return;
    }
    alert("Купона беше успешно отблеязан като приложен!");
    fetch();
  };

  console.log("=========");
  console.log(storeTypeData);
  console.log(item);
  console.log(error);
  console.log(isLoading);

  return (
    <div className="flex flex-col gap-10 justify-center items-center top-10 py-20 px-3 min-h-screen">
      <img src={logo} className="max-w-[100%] w-40" />
      {isLoading && <p className="text-center">Моля изчакайте ...</p>}
      {error && <>{error}</>}
      {!isLoading && !error && storeTypeData && item && (
        <div className="flex flex-col gap-2 p-0 w-full items-center justify-center max-w-xl">
          {item.is_active ? (
            <h2 className="text-green-500 text-xl">Купона е валиден!</h2>
          ) : (
            <h2 className="text-red-500 text-xl">Купона е неактивен!</h2>
          )}
          <div
            style={{
              opacity: item.is_active ? 1 : 0.5,
            }}
            className="w-full flex flex-col gap-5 rounded-xl border-borderColor border bg-backgroundShade p-4 py-6"
          >
            <div className="flex justify-center gap-3 w-full items-center">
              <img src={item!.user.avatar_url} width={30} height={30} />
              <p className="font-bold text-lg ">{item?.user.full_name}</p>
            </div>
            <div className="w-full border-t border-secondary"></div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <IonIcon name="ticket-outline" className="w-5 h-5" />
                  <h2 className="font-bold text-[1.2rem]">
                    {item?.coupon.title}
                  </h2>
                </div>
                <div className="flex gap-0.5 items-center">
                  <p className="font-bold text-primary text-[1.2rem]">
                    {item?.coupon.price}
                  </p>
                  <img src={coin} className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div className="p-2 px-3 rounded-xl bg-backgroundTint">
              Този купон ще Ви осигури {item.coupon.percent}% отстъпка при
              пазаруване в{" "}
              {storeTypeData.length === 1
                ? storeTypeData[0]?.additional.title.toLocaleLowerCase()
                : storeTypeData.map((storeType, i) => (
                    <strong key={"_Fd_" + i}>
                      {storeType!.additional.title.toLocaleLowerCase() +
                        (i === storeTypeData.length - 1
                          ? ""
                          : i === storeTypeData.length - 2
                          ? " или "
                          : ", ")}
                    </strong>
                  ))}
              . Най-голямата отстъпка която този купон може да ви усигори е{" "}
              {item.coupon.limit}лв.
            </div>
            <div className="flex justify-between w-full">
              <div className="flex rounded p-1 bg-backgroundTint">
                {storeTypeData.map((storeType) => (
                  <div
                    key={Math.random()}
                    className={`rounded p-1 aspect-square flex`}
                    style={{ backgroundColor: `rgb(${storeType?.color})` }}
                  >
                    <IonIcon
                      key={Math.random()}
                      name={storeType?.icon as any}
                      className="text-textShade w-4 h-4"
                    />
                  </div>
                ))}
              </div>
              <p className="text-accent text-lg font-semibold">
                Намал. <strong>{item.coupon.percent}</strong>%
              </p>
              <p className="text-text text-lg font-semibold">
                Лимит. <strong>{item.coupon.limit}</strong>лв.
              </p>
            </div>
          </div>
          <button
            style={{
              opacity: item.is_active ? 1 : 0.5,
            }}
            className="bg-primary text-white rounded-lg font-bold w-full p-2"
            onClick={() => deactivateCoupon()}
          >
            Отбележи като приложен
          </button>
        </div>
      )}
    </div>
  );
}
