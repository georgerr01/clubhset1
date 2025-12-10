export interface SheetRow {
  email: string;
  igAccount: string;
  theme: string;
  keyword: string;
  title: string;
  igLink: string;
}

const SHEET_ID = '1iKF-OazNLg2eH_GpD0uZzmLpK8BRWKWyc6rHkmPPUmc';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

export async function fetchSheetData(): Promise<SheetRow[]> {
  try {
    const response = await fetch(CSV_URL);
    const csvText = await response.text();
    
    const lines = csvText.split('\n').filter(line => line.trim());
    
    // Skip only the header row (first line)
    const dataLines = lines.slice(1);
    
    const rows: SheetRow[] = dataLines.map(line => {
      const values = parseCSVLine(line);
      return {
        email: values[0]?.trim() || '',
        igAccount: values[1]?.trim() || '',
        theme: values[2]?.trim() || '',
        keyword: values[3]?.trim() || '',
        title: values[4]?.trim() || '',
        igLink: values[5]?.trim() || '',
      };
    }).filter(row => row.email);

    return rows;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return [];
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}
