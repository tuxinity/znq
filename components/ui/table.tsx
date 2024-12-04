/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

type TableProps<Data extends object> = {
  data: Data[];
  columns: ColumnDef<Data, any>[];
  columnCustom?: React.HTMLAttributes<HTMLTableCellElement>;
};

export const Table = <Data extends object>({
  data,
  columns,
  columnCustom,
}: TableProps<Data>) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="w-full bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  const meta: any = header.column.columnDef.meta;
                  return (
                    <th
                      key={header.id}
                      className={`
                        px-6 py-4 
                        text-center 
                        uppercase 
                        font-semibold 
                        tracking-wider
                        ${index === 0 ? 'rounded-tl-xl' : ''}
                        ${index === headerGroup.headers.length - 1 ? 'rounded-tr-xl' : ''}
                        ${meta?.isNumeric ? 'text-right' : ''}
                      `}
                      {...columnCustom}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={`
                  border-b border-gray-200 
                  transition-all duration-300 
                  hover:bg-blue-50
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                `}
              >
                {row.getVisibleCells().map(cell => {
                  const meta: any = cell.column.columnDef.meta;
                  return (
                    <td
                      key={cell.id}
                      className={`
                        px-6 py-4 
                        ${meta?.isNumeric ? 'text-right' : 'text-left'}
                        text-gray-700
                        font-medium
                      `}
                      {...columnCustom}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
};

export default Table;