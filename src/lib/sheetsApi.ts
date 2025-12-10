const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxoIectDz8Fge7Kd_clXa7x4sD_peRs66EhyiD_fHxMk8BZjo4ZQTp5KZd7pxZGUNEo2g/exec';

export interface UpdateData {
  email: string;
  igAccount: string;
  theme: string;
  keyword: string;
  title: string;
  igLink: string;
}

export async function updateSheetRow(data: UpdateData): Promise<{ success: boolean; message: string }> {
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return { success: true, message: '資料已更新' };
  } catch (error) {
    console.error('Error updating sheet:', error);
    return { success: false, message: '更新失敗，請稍後再試' };
  }
}

export async function registerUserToSheet(email: string): Promise<{ success: boolean; message: string }> {
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'register', email }),
    });

    return { success: true, message: '新用戶已新增' };
  } catch (error) {
    console.error('Error registering user to sheet:', error);
    return { success: false, message: '新增失敗，請稍後再試' };
  }
}
