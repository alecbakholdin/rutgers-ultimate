import FancyCurrency from "appComponents/textDisplay/FancyCurrency";
import { UserData } from "types/userData";

export default function FancyPrice({
  price,
  teamPrice,
  isTeam,
  userLoading,
  userData,
  size = 25,
}: {
  price: number;
  teamPrice?: number;
  isTeam?: boolean;
  userLoading?: boolean;
  userData?: UserData | undefined;
  size?: number;
}) {
  return (
    <FancyCurrency
      amount={isTeam ? teamPrice || price : price}
      size={size}
      loading={(userLoading && !userData) || userLoading}
    />
  );
}
