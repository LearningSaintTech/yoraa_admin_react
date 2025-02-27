import React, { useState, useEffect } from 'react';
import { UserGroupIcon, FolderIcon, ListBulletIcon, TagIcon } from '@heroicons/react/24/outline';
import { getTotalUsersCount, getTotalCategoryCount, getTotalSubCategoryCount, getTotalItemCount } from "../../commonComponent/Api";

const colorMap = {
  blue: {
    bgColor: 'bg-blue-50',
    bgHoverColor: 'group-hover:bg-blue-100',
    textColor: 'text-blue-600',
    borderHoverColor: 'hover:border-blue-100',
    progressBg: 'bg-blue-50',
    progressBar: 'bg-blue-600'
  },
  green: {
    bgColor: 'bg-green-50',
    bgHoverColor: 'group-hover:bg-green-100',
    textColor: 'text-green-600',
    borderHoverColor: 'hover:border-green-100',
    progressBg: 'bg-green-50',
    progressBar: 'bg-green-600'
  },
  yellow: {
    bgColor: 'bg-yellow-50',
    bgHoverColor: 'group-hover:bg-yellow-100',
    textColor: 'text-yellow-600',
    borderHoverColor: 'hover:border-yellow-100',
    progressBg: 'bg-yellow-50',
    progressBar: 'bg-yellow-600'
  },
  purple: {
    bgColor: 'bg-purple-50',
    bgHoverColor: 'group-hover:bg-purple-100',
    textColor: 'text-purple-600',
    borderHoverColor: 'hover:border-purple-100',
    progressBg: 'bg-purple-50',
    progressBar: 'bg-purple-600'
  }
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    categories: 0,
    subCategories: 0,
    items: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersResponse,
          categoriesResponse,
          subCategoriesResponse,
          itemsResponse
        ] = await Promise.all([
          getTotalUsersCount(),
          getTotalCategoryCount(),
          getTotalSubCategoryCount(),
          getTotalItemCount()
        ]);

        setStats({
          users: usersResponse.data.totalUsers,
          categories: categoriesResponse.data.totalCategories,
          subCategories: subCategoriesResponse.data.totalSubCategories,
          items: itemsResponse.data.totalItems
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const StatCard = ({ icon: Icon, title, value, color }) => {
    const colors = colorMap[color];
    
    return (
      <div className={`group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 ${colors.borderHoverColor} h-full`}>
        <div className="flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
              <p className="text-3xl font-semibold text-gray-900">{value}</p>
            </div>
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${colors.bgColor} ${colors.bgHoverColor} transition-colors`}>
              <Icon className={`w-6 h-6 ${colors.textColor}`} />
            </div>
          </div>
          <div className="mt-4">
            <div className={`h-1 ${colors.progressBg} rounded-full`}>
              <div className={`h-full ${colors.progressBar} rounded-full transition-all duration-500`} style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={UserGroupIcon}
          title="Total Users"
          value={stats.users}
          color="blue"
        />
        <StatCard
          icon={FolderIcon}
          title="Total Categories"
          value={stats.categories}
          color="green"
        />
        <StatCard
          icon={ListBulletIcon}
          title="Subcategories"
          value={stats.subCategories}
          color="yellow"
        />
        <StatCard
          icon={TagIcon}
          title="Total Items"
          value={stats.items}
          color="purple"
        />
      </div>
    </div>
  );
}

export default AdminDashboard;