const axios = require("axios");

async function fetchDataAndSave() {
  const response = await axios.get("공공API_URL");
  const data = response.data;

  // 예시로 데이터 저장
  connection.query(
    "INSERT INTO public_data (data_field1, data_field2) VALUES (?, ?)",
    [data.field1, data.field2],
    (err, results) => {
      if (err) throw err;
      console.log("Data saved:", results);
    }
  );
}

fetchDataAndSave();
