import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchSheetData, SheetRow } from '@/lib/sheets';
import { updateSheetRow } from '@/lib/sheetsApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { RefreshCw, LogOut, Edit2, Save, X } from 'lucide-react';

export const DataTable = () => {
  const { user, signOut } = useAuth();
  const [data, setData] = useState<SheetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedRow, setEditedRow] = useState<SheetRow | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const rows = await fetchSheetData();
    setData(rows);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const canEdit = (row: SheetRow) => {
    return user?.email?.toLowerCase() === row.email.toLowerCase();
  };

  const handleEdit = (index: number, row: SheetRow) => {
    setEditingIndex(index);
    setEditedRow({ ...row });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedRow(null);
  };

  const handleSave = async () => {
    if (!editedRow) return;

    setSaving(true);
    const result = await updateSheetRow({
      email: editedRow.email,
      igAccount: editedRow.igAccount,
      theme: editedRow.theme,
      keyword: editedRow.keyword,
      title: editedRow.title,
      igLink: editedRow.igLink,
    });

    if (result.success) {
      const newData = [...data];
      if (editingIndex !== null) {
        newData[editingIndex] = editedRow;
        setData(newData);
      }
      toast({
        title: '成功',
        description: result.message,
      });
    } else {
      toast({
        title: '錯誤',
        description: result.message,
        variant: 'destructive',
      });
    }

    setSaving(false);
    setEditingIndex(null);
    setEditedRow(null);
  };

  const handleInputChange = (field: keyof SheetRow, value: string) => {
    if (editedRow) {
      setEditedRow({ ...editedRow, [field]: value });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          登入帳號: {user?.email}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            重新載入
          </Button>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            登出
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>我的資料</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              沒有找到資料
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>電郵</TableHead>
                    <TableHead>IG 賬號</TableHead>
                    <TableHead>主題</TableHead>
                    <TableHead>KEYWORD</TableHead>
                    <TableHead>標題</TableHead>
                    <TableHead>IG Link</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>
                        {editingIndex === index ? (
                          <Input
                            value={editedRow?.igAccount || ''}
                            onChange={(e) => handleInputChange('igAccount', e.target.value)}
                            className="w-32"
                          />
                        ) : (
                          row.igAccount
                        )}
                      </TableCell>
                      <TableCell>
                        {editingIndex === index ? (
                          <Input
                            value={editedRow?.theme || ''}
                            onChange={(e) => handleInputChange('theme', e.target.value)}
                            className="w-24"
                          />
                        ) : (
                          row.theme
                        )}
                      </TableCell>
                      <TableCell>
                        {editingIndex === index ? (
                          <Input
                            value={editedRow?.keyword || ''}
                            onChange={(e) => handleInputChange('keyword', e.target.value)}
                            className="w-24"
                          />
                        ) : (
                          row.keyword
                        )}
                      </TableCell>
                      <TableCell>
                        {editingIndex === index ? (
                          <Input
                            value={editedRow?.title || ''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-32"
                          />
                        ) : (
                          row.title
                        )}
                      </TableCell>
                      <TableCell>
                        {editingIndex === index ? (
                          <Input
                            value={editedRow?.igLink || ''}
                            onChange={(e) => handleInputChange('igLink', e.target.value)}
                            className="w-40"
                          />
                        ) : (
                          row.igLink ? (
                            <a
                              href={row.igLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              查看
                            </a>
                          ) : '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {canEdit(row) ? (
                          editingIndex === index ? (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSave}
                                disabled={saving}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancel}
                                disabled={saving}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(index, row)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
