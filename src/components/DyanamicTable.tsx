// components/DynamicTable.jsx
import React from 'react';

const DynamicTable = ({
  columns = [],
  columnWidths = [],
  data = [],
  title = '',
  showIndex = false,
  className = '',
  onRowClick,
  emptyMessage = 'No data available',
  loading = false,
  compact = false,
  bordered = true,
  striped = true,
  hoverable = true,
}) => {
  
  const renderCell = (item, column) => {
    const { key, render, align = 'left' } = column;
    
    if (render) {
      return render(item);
    }
    
    const value = key.split('.').reduce((obj, k) => obj?.[k], item);
    return value ?? '-';
  };

  const getColumnStyle = (index) => {
    const width = columnWidths[index] || columns[index]?.width;
    return width ? { 
      width: typeof width === 'number' ? `${width}px` : width,
      minWidth: typeof width === 'number' ? `${width}px` : width,
    } : {};
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-[#3b82f6] border-t-transparent"></div>
          <span className="mt-3 text-gray-500">Loading data...</span>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center py-16 border border-gray-200 rounded-lg">
        <div className="text-gray-300 mb-3">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const cellPadding = compact ? 'px-3 py-2' : 'px-4 py-3';

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {title && (
        <div className="px-4 sm:px-6 py-3 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{title}</h3>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <div className="min-w-max inline-block align-middle w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {showIndex && (
                  <th 
                    style={{ width: '60px', minWidth: '60px' }}
                    className={`
                      ${cellPadding}
                      text-left text-sm font-semibold text-white bg-[#3b82f6]
                      ${bordered ? 'border-r border-white/30' : ''}
                      sticky left-0 z-20
                    `}
                  >
                    <div className="text-center">#</div>
                  </th>
                )}
                
                {columns.map((column, index) => (
                  <th
                    key={column.key || index}
                    style={getColumnStyle(index)}
                    className={`
                      ${cellPadding}
                      text-left text-sm font-semibold text-white bg-[#3b82f6]
                      ${bordered && index < columns.length - 1 ? 'border-r border-white/30' : ''}
                      whitespace-nowrap
                    `}
                  >
                    <div className={`text-${column.align || 'left'} truncate`} title={column.title}>
                      {column.title}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {data.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`
                    ${hoverable ? 'hover:bg-gray-50' : ''}
                    ${onRowClick ? 'cursor-pointer' : ''}
                    border-b border-gray-200 last:border-b-0
                    ${striped && rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                  `}
                >
                  {showIndex && (
                    <td 
                      style={{ width: '60px', minWidth: '60px' }}
                      className={`
                        ${cellPadding}
                        text-sm text-gray-600
                        ${bordered ? 'border-r border-gray-200' : ''}
                        ${striped && rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                        sticky left-0 z-10
                      `}
                    >
                      <div className="text-center font-medium">{rowIndex + 1}</div>
                    </td>
                  )}
                  
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      style={getColumnStyle(colIndex)}
                      className={`
                        ${cellPadding}
                        text-sm text-gray-700
                        ${bordered && colIndex < columns.length - 1 ? 'border-r border-gray-200' : ''}
                        ${striped && rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                        whitespace-nowrap
                      `}
                    >
                      <div className={`text-${column.align || 'left'} truncate`}>
                        {renderCell(item, column)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Mobile Scroll Indicator */}
      {/* <div className="px-4 py-3 border-t border-gray-200 bg-gray-50/50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span className="hidden sm:inline">Scroll horizontally to view all columns</span>
            <span className="sm:hidden">Swipe left/right to view all columns</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-gray-200 rounded text-xs">
              {columns.length} columns
            </span>
            <span className="px-2 py-1 bg-gray-200 rounded text-xs">
              {data.length} rows
            </span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default DynamicTable;