import React, { useCallback, useEffect, useState } from "react";
import {
  faDollarSign,
  faUsers,
  faUserTimes,
  faCreditCard,
  faExternalLinkAlt,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { toast } from "react-toastify";
import apiFetch from "../../../utils/axios";
import DashboardCardSkeleton from "../../skeletons/DashboardCardSkeleton";
import TableRowSkeleton from "../../skeletons/TableRowSkeleton";

const Subscriptions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [subscriptionsData, setSubscriptionsData] = useState([]);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activeSubscriptions: 0,
    canceledSubscriptions: 0,
    totalMonthlyAmount: 0,
    totalQuarterlyAmount: 0,
    totalSixMonthAmount: 0,
    totalYearlyAmount: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [revenuePeriod, setRevenuePeriod] = useState("monthly");

  const getStats = useCallback(() => {
    setIsStatsLoading(true);
    apiFetch
      .get("/admin/subscriptions/stats")
      .then((res) => {
        setStats(res.data);
      })
      .catch(() => {
        toast("Error fetching subscription stats", { type: "error" });
      })
      .finally(() => {
        setIsStatsLoading(false);
      });
  }, []);

  const getSubscriptions = useCallback(() => {
    setIsLoading(true);
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: "10",
    });

    if (statusFilter !== "all") {
      params.append("status", statusFilter);
    }

    if (searchTerm) {
      params.append("search", searchTerm);
    }

    apiFetch
      .get(`/admin/subscriptions?${params}`)
      .then((res) => {
        setSubscriptionsData(res.data.subscriptions);
        setTotalPages(res.data.pages);
      })
      .catch(() => {
        toast("Error fetching subscriptions", { type: "error" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentPage, statusFilter, searchTerm]);

  const getRevenueAmount = () => {
    switch (revenuePeriod) {
      case "monthly":
        return stats.totalMonthlyAmount;
      case "quarterly":
        return stats.totalQuarterlyAmount;
      case "sixMonth":
        return stats.totalSixMonthAmount;
      case "yearly":
        return stats.totalYearlyAmount;
      default:
        return stats.totalMonthlyAmount;
    }
  };

  const getRevenueLabel = () => {
    switch (revenuePeriod) {
      case "monthly":
        return "Monthly Revenue";
      case "quarterly":
        return "Quarterly Revenue";
      case "sixMonth":
        return "6-Month Revenue";
      case "yearly":
        return "Yearly Revenue";
      default:
        return "Monthly Revenue";
    }
  };

  useEffect(() => {
    getStats();
  }, [getStats]);

  useEffect(() => {
    getSubscriptions();
  }, [getSubscriptions]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary">Subscriptions</h1>
        <a
          href="https://dashboard.stripe.com/subscriptions"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/80 transition-all duration-300 flex items-center gap-2 font-medium"
        >
          <FontAwesomeIcon icon={faExternalLinkAlt} />
          Manage Subscriptions
        </a>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-secondary" />
            <span className="font-medium text-gray-700">Revenue Period:</span>
          </div>
          <select
            value={revenuePeriod}
            onChange={(e) => setRevenuePeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="sixMonth">6 Months</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isStatsLoading ? (
          <>
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
          </>
        ) : (
          <>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg rounded-lg p-6 transform transition-transform duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{getRevenueLabel()}</h2>
                  <p className="text-2xl font-bold">{formatCurrency(getRevenueAmount())}</p>
                  <a
                    href="https://dashboard.stripe.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded-md transition-all duration-300 flex items-center gap-1 inline-block"
                  >
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs mr-1" />
                    See More Insights
                  </a>
                </div>
                <FontAwesomeIcon icon={faDollarSign} className="text-3xl opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg rounded-lg p-6 transform transition-transform duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Total Subscribers</h2>
                  <p className="text-2xl font-bold">{stats.totalSubscribers}</p>
                </div>
                <FontAwesomeIcon icon={faUsers} className="text-3xl opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg rounded-lg p-6 transform transition-transform duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Active</h2>
                  <p className="text-2xl font-bold">{stats.activeSubscriptions}</p>
                </div>
                <FontAwesomeIcon icon={faCreditCard} className="text-3xl opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg rounded-lg p-6 transform transition-transform duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Canceled</h2>
                  <p className="text-2xl font-bold">{stats.canceledSubscriptions}</p>
                </div>
                <FontAwesomeIcon icon={faUserTimes} className="text-3xl opacity-80" />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="canceled">Canceled</option>
            <option value="past_due">Past Due</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-scroll">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-secondary text-white">
            <tr>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                Customer
              </th>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                Product
              </th>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                Amount
              </th>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                Status
              </th>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                Created
              </th>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                Current Period
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableRowSkeleton columns={6} rows={4} />
            ) : (
              subscriptionsData?.map((subscription) => (
                <tr
                  key={subscription.id}
                  className="hover:bg-gray-50 text-xs sm:text-sm"
                >
                  <td className="border border-gray-300 p-2">
                    <div>
                      <div className="font-semibold">{subscription.customerName || "N/A"}</div>
                      <div className="text-gray-600">{subscription.customerEmail}</div>
                    </div>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div>
                      <div className="font-semibold">{subscription.productName}</div>
                      <div className="text-gray-600">
                        {subscription.interval} • {subscription.quantity} {subscription.quantity > 1 ? 'items' : 'item'}
                      </div>
                    </div>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div className="font-semibold">
                      {formatCurrency(subscription.amount, subscription.currency)}
                    </div>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span
                      className={clsx("px-2 py-1 rounded-full text-xs font-medium", {
                        "bg-green-100 text-green-800": subscription.status === "active",
                        "bg-red-100 text-red-800": subscription.status === "canceled",
                        "bg-yellow-100 text-yellow-800": subscription.status === "past_due",
                        "bg-gray-100 text-gray-800": subscription.status === "unpaid",
                      })}
                    >
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    {formatDate(subscription.created)}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div>
                      <div>Start: {formatDate(subscription.currentPeriodStart)}</div>
                      <div>End: {formatDate(subscription.currentPeriodEnd)}</div>
                    </div>
                  </td>
                </tr>
              ))
            )}
            {!isLoading && !subscriptionsData.length ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  No subscriptions found
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={clsx(
                "px-4 py-2 rounded-lg transition-all duration-300",
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-secondary text-white hover:bg-secondary/80"
              )}
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-gray-100 rounded-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={clsx(
                "px-4 py-2 rounded-lg transition-all duration-300",
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-secondary text-white hover:bg-secondary/80"
              )}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
