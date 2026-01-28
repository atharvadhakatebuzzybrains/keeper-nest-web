import { useEffect, useState, useMemo, useCallback } from 'react';
import { databases } from '../../appwrite/config';
import { Query } from 'appwrite';
import {
  Users, ChevronLeft, ChevronRight, Mail, RefreshCw,
  Calendar, UserPlus, Phone, Search, ArrowLeft, X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Input } from '../ui/input';
import { account } from '../../appwrite/config';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaTimes } from 'react-icons/fa';

export default function EmployeeList() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [userInitial, setUserInitial] = useState('');
  const pageSize = 4;
  const navigate = useNavigate();

  useEffect(() => {
    const getInitial = async () => {
      try {
        const user = await account.get();
        if (user && user.name) {
          setUserInitial(String(user.name).charAt(0).toUpperCase());
        }
      } catch (err) {
        console.log(err);
      }
    };
    getInitial();
  }, []);

  const handleSearchChange = (query: string) => {
    setInputValue(query);
    setSearchQuery(query);
    setPage(1);
  };

  const handleClearSearch = () => {
    setInputValue('');
    setSearchQuery('');
  };

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      handleClearSearch();
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const fetchEmployees = useCallback(async () => {
    try {
      await account.get();

      const queries = [
        Query.equal('role', 'employee'),
        Query.equal('status', 'active')
      ];

      if (searchQuery.trim()) {
        queries.push(Query.or([
          Query.search('name', searchQuery),
          Query.search('employeeId', searchQuery),
          Query.search('email', searchQuery)
        ]));
        queries.push(Query.limit(100));
      } else {
        queries.push(Query.limit(pageSize));
        queries.push(Query.offset((page - 1) * pageSize));
      }

      const res = await databases.listDocuments(
        'user_info',
        'user_info',
        queries
      );

      const countQueries = [
        Query.equal('role', 'employee'),
        Query.equal('status', 'active')
      ];

      if (searchQuery.trim()) {
        countQueries.push(Query.search('name', searchQuery));
      }

      const countRes = await databases.listDocuments('user_info', 'user_info', countQueries);
      setTotalEmployees(countRes.total);

      return res.documents;
    } catch (error: any) {
      console.error("Error fetching employees:", error);
      if (error.message?.includes('Session')) {
        navigate('/login');
      }

      if (error.message?.includes('Search') || error.message?.includes('index')) {
        console.log("Search index not available, using client-side filtering");

        const fallbackQueries = [
          Query.equal('role', 'employee'),
          Query.equal('status', 'active'),
          Query.limit(100)
        ];

        const res = await databases.listDocuments('user_info', 'user_info', fallbackQueries);
        setTotalEmployees(res.total);
        return res.documents;
      }

      throw error;
    }
  }, [navigate, page, searchQuery, pageSize]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await fetchEmployees();
      setEmployees(data || []);
    } catch (error) {
      console.error("Failed to load employees:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [page, searchQuery]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadEmployees();
  };

  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) {
      return employees;
    }

    const query = searchQuery.toLowerCase();
    return employees.filter((item) => {
      return (
        item.name?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.employeeId?.toLowerCase().includes(query)
      );
    });
  }, [employees, searchQuery]);

  const totalPages = useMemo(() => {
    if (searchQuery.trim()) {
      const filteredCount = filteredEmployees.length;
      return Math.ceil(filteredCount / pageSize);
    } else {
      return Math.ceil(totalEmployees / pageSize);
    }
  }, [searchQuery, filteredEmployees.length, totalEmployees, pageSize]);

  const paginatedData = useMemo(() => {
    if (searchQuery.trim()) {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return filteredEmployees.slice(start, end);
    } else {
      return employees;
    }
  }, [searchQuery, page, pageSize, filteredEmployees, employees]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const EmployeeCard = ({ employee }: { employee: any }) => (
    <Card
      className="h-full border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group overflow-hidden"
      onClick={() => navigate(`employeeDetails/${employee.employeeId}`,
        {
          state: { employee }
        }
      )}
    >
      <CardContent className="p-0 flex flex-col h-full">
        <div className="px-4 sm:px-5 py-4 sm:py-5 border-b border-blue-50 bg-gradient-to-r from-blue-50 to-blue-100/50">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-white shadow-lg flex-shrink-0 group-hover:border-blue-100 transition-colors duration-200 rounded-none overflow-hidden">
              <AvatarImage
                src={employee.gender?.toLowerCase() === 'female' ? '/src/assets/images/woman.png' : '/src/assets/images/man.png'}
                alt={employee.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-bold shadow-sm rounded-none">
                {employee.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors duration-200">
                  {employee.name}
                </h3>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs bg-white text-blue-600 border-blue-300 px-2 py-0 h-5 font-semibold">
                  #{employee.employeeId}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-5 py-4 flex-1 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50/50 transition-colors duration-150">
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors duration-200">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-700 truncate" title={employee.email}>
                  {employee.email}
                </p>
              </div>
            </div>

            {employee.phone && (
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50/50 transition-colors duration-150">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors duration-200">
                  <Phone className="h-4 w-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-700 truncate">
                    {employee.phone}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Phone</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-blue-500" />
                  <div className="text-xs text-gray-500">Joined</div>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {new Date(employee.$createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <UserPlus className="h-3 w-3 text-blue-500" />
                  <div className="text-xs text-gray-500">Created By</div>
                </div>
                <div className="text-sm font-semibold text-gray-900 truncate" title={employee.creatorMail || 'Admin'}>
                  {employee.creatorMail?.split('@')[0] || 'Admin'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SkeletonCard = () => (
    <Card className="border border-gray-200 h-full overflow-hidden">
      <CardContent className="p-0">
        <div className="px-4 sm:px-5 py-4 sm:py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100/50">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14 sm:h-16 sm:w-16 rounded-none flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-36" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-5 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
      <div className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-[#3b82f6]/10 rounded-lg transition-colors text-[#3b82f6] flex-shrink-0"
              aria-label="Go back"
            >
              <FaArrowLeft size={20} />
            </button>

            {(!isSearchActive) && (
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-semibold text-gray-800 truncate">
                  Employee Directory
                </h1>
                <p className="text-sm text-gray-500 truncate">
                  Manage and view employee information
                </p>
              </div>
            )}

            {isSearchActive && (
              <div className="flex-1 sm:hidden">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search employees..."
                    value={inputValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full px-4 py-2 pl-10 pr-10 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Search size={16} />
                  </div>
                  {inputValue && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {!isSearchActive && (
            <div className="hidden sm:block flex-1 max-w-lg mx-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search employees..."
                  value={inputValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-10 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search size={16} />
                </div>
                {inputValue && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={toggleSearch}
              className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              aria-label={isSearchActive ? "Close search" : "Open search"}
            >
              {isSearchActive ? <X size={20} /> : <Search size={20} />}
            </button>

            <div className="flex-shrink-0">
              <div
                className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity"
                role="img"
                aria-label={`User initial ${userInitial || 'U'}`}
                title="Profile"
              >
                {userInitial || 'U'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 auto-rows-fr items-stretch">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : paginatedData.length > 0 ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-blue-600">{paginatedData.length}</span> employees • Page{' '}
                <span className="font-semibold text-blue-600">{page}</span> of{' '}
                <span className="font-semibold text-blue-600">{totalPages}</span>
              </p>

              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="h-11 gap-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-600 hover:text-blue-700 whitespace-nowrap"
              >
                {refreshing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 auto-rows-fr items-stretch">
              {paginatedData.map((employee) => (
                <EmployeeCard key={employee.$id} employee={employee} />
              ))}
            </div>
          </>
        ) : (
          <Card className="text-center py-16 border border-blue-200 bg-white shadow-sm mt-6">
            <CardContent>
              <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {searchQuery.trim()
                  ? `No employees found for "${searchQuery}"`
                  : 'No employees found'
                }
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery.trim()
                  ? 'Try adjusting your search terms to find what you\'re looking for.'
                  : 'Get started by adding new employees to your directory.'
                }
              </p>
            </CardContent>
          </Card>
        )}

        {totalPages > 0 && paginatedData.length > 0 && (
          <div className="mt-8 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={page === 1}
              className="gap-1 border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-600 hover:text-blue-700 px-3"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-md">
              <span className="text-sm text-gray-600">Page</span>
              <span className="mx-1 font-semibold text-blue-600">{page}</span>
              <span className="text-sm text-gray-600">of</span>
              <span className="ml-1 font-semibold text-blue-600">{totalPages}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="gap-1 border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-600 hover:text-blue-700 px-3"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}