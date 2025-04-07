import React, { useState, useRef } from 'react';
import { importCategoriesFromJson } from '../../firebase/services/productService';
import { Alert, Box, Button, Card, Checkbox, Container, FormControlLabel, Grid, TextField, Typography, Paper } from '@mui/material';
import { Upload, ArrowRight } from 'lucide-react';

const ImportCategoryData: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [replaceAll, setReplaceAll] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{ success: boolean; message: string; } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleJsonInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
    };
    reader.readAsText(file);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportClick = async () => {
    try {
      if (!jsonInput.trim()) {
        setResult({
          success: false,
          message: 'Vui lòng nhập dữ liệu JSON hoặc tải lên một file',
        });
        return;
      }

      let parsedData;
      try {
        parsedData = JSON.parse(jsonInput);
      } catch (error) {
        setResult({
          success: false,
          message: 'Định dạng JSON không hợp lệ. Vui lòng kiểm tra lại.',
        });
        return;
      }

      setIsLoading(true);
      setResult(null);

      const response = await importCategoriesFromJson(parsedData, replaceAll);
      
      setResult({
        success: response.success,
        message: response.message,
      });
    } catch (error: any) {
      setResult({
        success: false,
        message: `Lỗi: ${error.message || 'Không rõ lỗi'}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setJsonInput('');
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Nhập dữ liệu danh mục từ JSON
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Bạn có thể nhập dữ liệu danh mục bằng cách tải lên file JSON hoặc nhập trực tiếp vào ô bên dưới.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Nhập dữ liệu JSON
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<Upload size={18} />}
                onClick={handleFileButtonClick}
                fullWidth
                sx={{ p: 1.5 }}
              >
                Tải lên file JSON
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Hoặc nhập trực tiếp dữ liệu JSON:
            </Typography>
            
            <TextField
              multiline
              rows={10}
              fullWidth
              placeholder="Nhập dữ liệu JSON ở đây..."
              value={jsonInput}
              onChange={handleJsonInputChange}
              variant="outlined"
              sx={{ mb: 3 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={replaceAll}
                  onChange={(e) => setReplaceAll(e.target.checked)}
                />
              }
              label="Thay thế toàn bộ dữ liệu danh mục hiện có"
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleImportClick}
                disabled={isLoading || !jsonInput.trim()}
                endIcon={<ArrowRight size={18} />}
              >
                {isLoading ? 'Đang xử lý...' : 'Nhập dữ liệu'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleClear}
                disabled={isLoading}
              >
                Xóa dữ liệu
              </Button>
            </Box>

            {result && (
              <Alert
                severity={result.success ? 'success' : 'error'}
                sx={{ mt: 3 }}
              >
                {result.message}
              </Alert>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
              Cấu trúc dữ liệu mẫu
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Dữ liệu JSON cần có cấu trúc như ví dụ dưới đây:
            </Typography>
            <Box
              component="pre"
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: 'grey.50',
                overflowX: 'auto',
                fontSize: '0.75rem',
              }}
            >
              {JSON.stringify(
                {
                  "cat-roses": {
                    "name": "Hoa hồng",
                    "description": "Các loại hoa hồng tươi và đẹp",
                    "id": "roses",
                    "slug": "hoa-hong",
                    "displayName": "Hoa Hồng"
                  },
                  "cat-lily": {
                    "name": "Hoa lily",
                    "description": "Hoa lily tinh tế và thanh lịch",
                    "id": "lilies",
                    "slug": "hoa-lily",
                    "displayName": "Hoa Lily"
                  },
                  "cat-ky-niem": {
                    "name": "Hoa kỉ niệm",
                    "description": "Hoa dùng cho các dịp kỷ niệm",
                    "id": "ky-niem",
                    "slug": "hoa-ky-niem",
                    "displayName": "Hoa Kỉ Niệm"
                  }
                },
                null,
                2
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ImportCategoryData; 