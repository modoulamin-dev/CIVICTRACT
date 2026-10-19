function publicComplaint(complaint, updates = []) {
  const doc = complaint.toObject ? complaint.toObject() : complaint;
  return {
    id: String(doc._id),
    trackingNumber: doc.trackingNumber,
    category: doc.category,
    title: doc.title,
    description: doc.description,
    location: {
      region: doc.location?.region,
      area: doc.location?.area,
      landmark: doc.location?.landmark,
      coordinates: doc.location?.coordinates,
    },
    photoUrl: doc.photoUrl,
    status: doc.status,
    isUrgent: Boolean(doc.isUrgent),
    department: doc.department
      ? {
          id: String(doc.department._id || doc.department),
          name: doc.department.name,
          contactEmail: doc.department.contactEmail,
          contactPhone: doc.department.contactPhone,
        }
      : null,
    isPublic: doc.isPublic,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    resolvedAt: doc.resolvedAt,
    updates: updates.map((item) => ({
      id: String(item._id),
      type: item.type,
      fromStatus: item.fromStatus,
      toStatus: item.toStatus,
      message: item.message,
      createdAt: item.createdAt,
      author: item.author ? { name: item.author.name } : { name: "CivicTract" },
    })),
  };
}

function isStale(complaint) {
  if (complaint.status === "resolved") return false;
  const created = new Date(complaint.createdAt).getTime();
  return Date.now() - created > 7 * 24 * 60 * 60 * 1000;
}

module.exports = { publicComplaint, isStale };
