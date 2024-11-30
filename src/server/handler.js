const predictClassification = require("../services/InferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");

async function postPredictHandler(request, h) {
  const { image } = request.payload; // Mengambil image dari payload
  const { model } = request.server.app; // Mengambil model dari server.app

  try {
    // Panggil fungsi predictClassification
    const { confidenceScore, label, suggestion } = await predictClassification(
      model,
      image
    );

    const id = crypto.randomUUID(); // Buat UUID untuk ID unik
    const createdAt = new Date().toISOString(); // Tanggal saat data dibuat

    // Data hasil prediksi
    const data = {
      id: id,
      result: label,
      suggestion: suggestion,
      createdAt: createdAt,
    };

    // Simpan data ke Firestore (opsional jika diaktifkan)
    await storeData(id, data);

    // Response message selalu berdasarkan "suggestion"
    const response = h.response({
      status: "success",
      message: suggestion, // Gunakan nilai "suggestion" sebagai pesan
      data,
    });

    response.code(201); // Set HTTP status code 201
    return response;

  } catch (error) {
    // Tangani error yang berasal dari InferenceService atau lainnya
    console.error(error);
    return h.response({
      status: "fail",
      message: "Terjadi kesalahan dalam memproses prediksi.",
    }).code(500);
  }
}

module.exports = { postPredictHandler };
