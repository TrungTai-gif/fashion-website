import React from "react";

const generateMockLowStock = (count = 6) => {
  const items = [];
  for (let i = 1; i <= count; i++) {
    items.push({
      id: `p-${i}`,
      name: `Product ${i}`,
      variant: i % 2 === 0 ? `Size ${i}` : "-",
      stock: Math.floor(Math.random() * 5),
    });
  }
  return items;
};

const LowStockList = ({ products }) => {
  const list = products && products.length ? products : generateMockLowStock(6);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Low Stock Products
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Product
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Variant
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Stock
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {list.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{p.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{p.variant}</td>
                <td className="px-4 py-3 text-sm text-red-600 font-semibold">
                  {p.stock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowStockList;
