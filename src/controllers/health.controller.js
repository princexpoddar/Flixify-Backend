import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import os from "os";

const healthCheck = asyncHandler(async (req, res) => {
  const uptime = process.uptime();
  const timestamp = new Date().toISOString();
  const nodeVersion = process.version;
  const environment = process.env.NODE_ENV || "development";
  const platform = os.platform();
  const arch = os.arch();
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;

  const healthData = {
    status: "healthy",
    timestamp,
    uptime: {
      seconds: Math.floor(uptime),
      formatted: formatUptime(uptime),
    },
    server: {
      nodeVersion,
      environment,
      platform,
      arch,
    },
    memory: {
      total: formatBytes(totalMemory),
      used: formatBytes(usedMemory),
      free: formatBytes(freeMemory),
      usagePercentage: Math.round((usedMemory / totalMemory) * 100),
    },
  };

  return res
    .status(200)
    .json(new ApiResponse(200, healthData, "Server is healthy"));
});

// Helper function to format uptime
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

// Helper function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export { healthCheck };
