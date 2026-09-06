function formatINR(amount) {
  return `\u20B9${Number(amount).toLocaleString("en-IN")}`;
}

export default function EMIPlanList({ plans, selectedIndex, onSelect }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700 mb-2">EMI plans backed by mutual funds</p>
      {plans.map((plan, index) => {
        const isSelected = index === selectedIndex;
        return (
          <button
            key={plan.tenureMonths}
            type="button"
            onClick={() => onSelect(index)}
            className={`w-full text-left rounded-xl border px-4 py-3 flex items-center justify-between transition-colors ${
              isSelected
                ? "border-brand ring-1 ring-brand bg-brand-card"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-gray-900">
                  {formatINR(plan.monthlyAmount)} x {plan.tenureMonths} months
                </span>
              </div>
              {plan.cashback > 0 && (
                <p className="text-xs text-green-600 mt-0.5">
                  Additional cashback of {formatINR(plan.cashback)}
                </p>
              )}
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {plan.interestRate > 0 ? `${plan.interestRate}% interest` : "0% interest"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
