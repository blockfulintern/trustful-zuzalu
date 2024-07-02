export enum BadgeStatus {
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
}

export const BadgeTagIcon = ({ status }: { status: BadgeStatus }) => {
  const Badge: Record<BadgeStatus, React.ReactNode> = {
    [BadgeStatus.CONFIRMED]: (
      <div className="bg-lime-400/10 p-2 rounded-full justify-center items-center inline-flex text-lime-400 text-xs font-medium font-['Inter'] uppercase leading-[13.20px] tracking-wide">
        {BadgeStatus.CONFIRMED}
      </div>
    ),
    [BadgeStatus.PENDING]: (
      <div className="bg-red-500/10 p-2 rounded-full justify-center items-center inline-flex text-red-500 text-xs font-medium font-['Inter'] uppercase leading-[13.20px] tracking-wide">
        {BadgeStatus.PENDING}
      </div>
    ),
  };

  return (
    <div className="shadow-tag p-semibold-dark flex items-center">
      {Badge[status]}
    </div>
  );
};
