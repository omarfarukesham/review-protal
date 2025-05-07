export const SkeletonRow = () => {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700"></div>
          <div className="max-w-[150px] sm:max-w-xs">
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex">
          <div className="flex space-x-1">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"
                ></div>
              ))}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-md float-right"></div>
      </td>
    </tr>
  );
};
