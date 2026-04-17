import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import COLLECTIONS from "../../firebase/collections";

export const createInstruction = async (payload) => {
  const ref = collection(db, COLLECTIONS.INSTRUCTIONS);
  const result = await addDoc(ref, {
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return result.id;
};

export const getAllInstructions = async () => {
  const ref = collection(db, COLLECTIONS.INSTRUCTIONS);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

export const getInstructionById = async (instructionId) => {
  const ref = doc(db, COLLECTIONS.INSTRUCTIONS, instructionId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export const getInstructionsByStatus = async (status) => {
  const ref = collection(db, COLLECTIONS.INSTRUCTIONS);
  const q = query(
    ref,
    where("status", "==", status),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

export const updateInstruction = async (instructionId, updates) => {
  const ref = doc(db, COLLECTIONS.INSTRUCTIONS, instructionId);
  await updateDoc(ref, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
  return true;
};

export const markInstructionCompleted = async (
  instructionId,
  completionNote,
) => {
  const ref = doc(db, COLLECTIONS.INSTRUCTIONS, instructionId);
  const snapshot = await getDoc(ref);
  const instruction = snapshot.exists() ? snapshot.data() : null;
  const completedAt = new Date().toISOString();

  await updateDoc(ref, {
    status: "Completed",
    completionNote,
    completedAt,
    updatedAt: completedAt,
  });

  if (instruction) {
    const historyRef = collection(db, COLLECTIONS.HISTORY);
    await addDoc(historyRef, {
      instructionId,
      requestId: instruction.requestId || null,
      quotationId: instruction.quotationId || null,
      itemName: instruction.itemName || instruction.title || "Untitled Item",
      vendorName: instruction.vendorName || "Unknown Vendor",
      vendorContact: instruction.vendorContact || instruction.vendorPhone || "",
      specification: instruction.specification || instruction.description || "",
      address: instruction.address || instruction.vendorAddress || "",
      amount: Number(instruction.amount || 0),
      campus: instruction.campus || "",
      shift: instruction.shift || "",
      approvedBy: instruction.approvedBy || "Admin",
      approvedAt: instruction.approvedAt || instruction.createdAt || "",
      status: "Completed",
      completionNote,
      completedAt,
      createdAt: completedAt,
      timeline: [
        {
          title: "Purchase Instruction Created",
          description: "Instruction sent for procurement execution.",
          time: instruction.createdAt || "",
        },
        instruction.approvedAt
          ? {
              title: "Quotation Approved",
              description: "Final quotation approved for processing.",
              time: instruction.approvedAt,
            }
          : null,
        {
          title: "Procurement Completed",
          description:
            completionNote || "Completion note added and history archived.",
          time: completedAt,
        },
      ].filter(Boolean),
    });
  }

  return true;
};
