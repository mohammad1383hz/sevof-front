interface SupportButtonProps {
  supportLink?: string;
  className?: string;
}

const SupportButton = ({ supportLink, className = '' }: SupportButtonProps) => {
  const handleSupportClick = () => {
    if (supportLink) {
      window.open(supportLink, '_blank');
    }
  };

  return (
    <div className={`text-center mt-8 ${className}`}>
      <button
        onClick={handleSupportClick}
        disabled={!supportLink}
        className={`font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2  ${
          supportLink 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
        }`}
      >
        {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg> */}
        <span>
          {supportLink ? 'Contact support' : 'Contact support (unavailable)'}
        </span>
      </button>
    </div>
  );
};

export default SupportButton;
