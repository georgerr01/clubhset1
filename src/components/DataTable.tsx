import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchSheetData, SheetRow } from '@/lib/sheets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { LogOut, RefreshCw, Pencil, X, Check, ExternalLink, Loader2 } from 'lucide-react';

export const DataTable = () => {
  const { user, signOut } = useAuth();
  const [data, setData] = useState<SheetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedRow, setEditedRow] = useState<SheetRow | null>(null);

  const loadData = async () => {
    setLoading(true);
    const rows = await fetchSheetData();
    setData(rows);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const userEmail = user?.email?.toLowerCase();

  const canEdit = (row: SheetRow) => {
    return row.email.toLowerCase() === userEmail;
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditedRow({ ...data[index] });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedRow(null);
  };

  const handleSave = () => {
    // Since we can't directly edit Google Sheets without API,
    // we'll show a message that this is read-only mode
    toast.info('由於此表格為公開唯讀模式，編輯功能需要連接 Google Sheets API。');
    handleCancel();
  };

  const handleInputChange = (field: keyof SheetRow, value: string) => {
    if (editedRow) {
      setEditedRow({ ...editedRow, [field]: value });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('已登出');
  };

  return (
    <div className="min-h-screen gradient-subtle p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">IG 資料管理</h1>
            <p className="text-muted-foreground mt-1">
              已登入為：<span className="font-medium text-accent-foreground">{user?.email}</span>
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={loadData}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              重新載入
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
            >
              <LogOut className="w-4 h-4" />
              登出
            </Button>
          </div>
        </div>

        {/* Info Card */}
        <Card className="border-accent bg-accent/30">
          <CardContent className="py-3">
            <p className="text-sm text-accent-foreground">
              您只能編輯電郵地址與您登入帳戶相符的列。其他列為唯讀模式。
            </p>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="shadow-card overflow-hidden">
          <CardHeader>
            <CardTitle>資料列表</CardTitle>
            <CardDescription>
              共 {data.length} 筆資料 · 可編輯 {data.filter(canEdit).length} 筆
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : data.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                暫無資料
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">電郵</TableHead>
                      <TableHead className="font-semibold">IG 賬號</TableHead>
                      <TableHead className="font-semibold">主題</TableHead>
                      <TableHead className="font-semibold">KEYWORD</TableHead>
                      <TableHead className="font-semibold">標題</TableHead>
                      <TableHead className="font-semibold">IG Link</TableHead>
                      <TableHead className="font-semibold w-[100px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row, index) => {
                      const isEditing = editingIndex === index;
                      const isEditable = canEdit(row);
                      
                      return (
                        <TableRow 
                          key={index}
                          className={`
                            ${isEditable ? 'bg-accent/20 hover:bg-accent/30' : 'hover:bg-muted/30'}
                            transition-colors
                          `}
                        >
                          <TableCell className="font-medium">
                            {row.email}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input
                                value={editedRow?.igAccount || ''}
                                onChange={(e) => handleInputChange('igAccount', e.target.value)}
                                className="h-8"
                              />
                            ) : (
                              row.igAccount
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input
                                value={editedRow?.theme || ''}
                                onChange={(e) => handleInputChange('theme', e.target.value)}
                                className="h-8"
                              />
                            ) : (
                              row.theme
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input
                                value={editedRow?.keyword || ''}
                                onChange={(e) => handleInputChange('keyword', e.target.value)}
                                className="h-8"
                              />
                            ) : (
                              row.keyword
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input
                                value={editedRow?.title || ''}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="h-8"
                              />
                            ) : (
                              row.title
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input
                                value={editedRow?.igLink || ''}
                                onChange={(e) => handleInputChange('igLink', e.target.value)}
                                className="h-8"
                              />
                            ) : row.igLink ? (
                              <a 
                                href={row.igLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-primary hover:underline"
                              >
                                查看
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditable && (
                              <div className="flex gap-1">
                                {isEditing ? (
                                  <>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                                      onClick={handleSave}
                                    >
                                      <Check className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                      onClick={handleCancel}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-primary hover:bg-primary/10"
                                    onClick={() => handleEdit(index)}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
