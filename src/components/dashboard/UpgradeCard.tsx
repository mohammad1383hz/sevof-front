
interface UpgradeCardProps {
  onEnable: () => void;
}

const features = [
  "Daily article generation",
  "Automatic publishing",
  "Smart scheduling",
  "WordPress Auto Publish",
];

const UpgradeCard: React.FC<UpgradeCardProps> = ({ onEnable }) => (
  <div className="bg-gradient-to-r from-[#5B47FB] to-[#4935E0] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div>
      <h2 className="font-bold text-lg mb-1">Enable smart automation</h2>
      <ul className="text-sm text-[#EFEDFF] space-y-1 mt-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
            {f}
          </li>
        ))}
      </ul>
    </div>
    <button
      onClick={onEnable}
      className="bg-white text-[#5B47FB] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#EFEDFF] transition-colors shrink-0"
    >
      Enable
    </button>
  </div>
);

export default UpgradeCard;