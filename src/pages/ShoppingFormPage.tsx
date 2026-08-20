import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BottomSheet } from '../components/BottomSheet/BottomSheet';

type Sheet = 'reuse' | 'delete' | null;
const PHOTO_SRC = '/shopping-pantry.svg';
const SHOPPING_ITEMS = [
  { id: 'milk', name: '牛乳', quantity: '1本', memo: '朝食用の普通の牛乳。' },
  { id: 'eggs', name: '卵', quantity: '10個', memo: '作り置きにも使う。' },
  { id: 'detergent', name: '洗濯洗剤', quantity: '詰替え 1袋', memo: '' },
];
const STATE_NAMES = ['normal', 'reuse-picker', 'reuse-selected', 'photo-selected', 'long-text'];

export function ShoppingFormPage({ isEdit, state }: { isEdit: boolean; state: string }) {
  const safeState = STATE_NAMES.includes(state) ? state : 'normal';
  const deleteConfirm = isEdit && state === 'delete-confirm';
  const selectedFixture = safeState === 'reuse-selected' ? SHOPPING_ITEMS[0] : null;
  const [name, setName] = useState(safeState === 'long-text' ? '家族みんなで食べられる甘さ控えめの季節のフルーツ' : selectedFixture?.name ?? (isEdit ? '洗濯洗剤' : '牛乳'));
  const [quantity, setQuantity] = useState(safeState === 'long-text' ? '大きめ 1パック' : selectedFixture?.quantity ?? (isEdit ? '詰替え 1袋' : '1本'));
  const [memo, setMemo] = useState(safeState === 'long-text' ? '冷蔵庫の一番上に入れられるサイズで、傷みの少ないものを選ぶ。帰宅後すぐに洗って朝食用に分けておく。' : selectedFixture?.memo ?? (isEdit ? 'いつもの売り場で探す。' : ''));
  const [photoSelected, setPhotoSelected] = useState(safeState === 'photo-selected' || isEdit);
  const [sheet, setSheet] = useState<Sheet>(() => {
    if (deleteConfirm) return 'delete';
    return safeState === 'reuse-picker' && !isEdit ? 'reuse' : null;
  });
  const [query, setQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const filteredItems = useMemo(() => SHOPPING_ITEMS.filter((item) => `${item.name}${item.quantity}`.includes(query)), [query]);

  const selectItem = (item: (typeof SHOPPING_ITEMS)[number]) => {
    setName(item.name); setQuantity(item.quantity); setMemo(item.memo); setSheet(null); setStatusMessage('以前の項目を反映しました');
  };

  return (
    <div className="screen-content form-page shopping-form-page" data-uilab-component="ShoppingForm.Page" data-uilab-id="shopping-form-page">
      <header className="form-page__header">
        <button type="button" className="form-page__back" aria-label="戻る" onClick={() => { window.location.hash = '#/shopping'; }}><ChevronLeft aria-hidden="true" /><span>戻る</span></button>
        <h1>{isEdit ? '買い物を編集' : '買い物を追加'}</h1>
      </header>
      {!isEdit ? <button type="button" className="form-reuse-trigger" data-uilab-component="ShoppingForm.ReusePickerTrigger" data-uilab-id="shopping-form-reuse-trigger" onClick={() => setSheet('reuse')}><span>以前の項目から選ぶ</span><ChevronRight aria-hidden="true" /></button> : null}
      <form className="form-layout" onSubmit={(event) => { event.preventDefault(); setStatusMessage('保存しました'); }}>
        <label className="form-control" data-uilab-component="ShoppingForm.Name" data-uilab-id="shopping-form-name"><span>商品名</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="商品名を入力" required /></label>
        <label className="form-control form-control--compact-field shopping-form__quantity" data-uilab-component="ShoppingForm.Quantity" data-uilab-id="shopping-form-quantity"><span>数量</span><input value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="例：1本" /></label>
        <label className="form-control" data-uilab-component="ShoppingForm.Memo" data-uilab-id="shopping-form-memo"><span>メモ</span><textarea rows={2} value={memo} onChange={(event) => setMemo(event.target.value)} placeholder="メモを入力" /></label>
        <div className="photo-control" data-uilab-component="ShoppingForm.Photo" data-uilab-id="shopping-form-photo">
          <div><span>写真</span>{photoSelected ? <span className="photo-control__state">選択済み</span> : null}</div>
          {photoSelected ? <div className="photo-preview"><img src={PHOTO_SRC} alt="選択した写真のプレビュー" /><button type="button" className="form-secondary" onClick={() => setPhotoSelected(false)}>外す</button></div> : <button type="button" className="photo-select" onClick={() => setPhotoSelected(true)}><ImageIcon aria-hidden="true" />写真を選ぶ</button>}
        </div>
        <div className={`form-actions${isEdit ? ' form-actions--edit' : ''}`}><button type="submit" className="form-save" data-uilab-component="ShoppingForm.Save" data-uilab-id="shopping-form-save">保存</button>{isEdit ? <button type="button" className="form-delete" data-uilab-component="ShoppingForm.Delete" data-uilab-id="shopping-form-delete" onClick={() => setSheet('delete')}>削除</button> : null}</div>
      </form>
      <p className="form-status" role="status" aria-live="polite">{statusMessage}</p>
      <BottomSheet open={sheet === 'reuse'} title="以前の項目から選ぶ" onClose={() => setSheet(null)}>
        <div className="reuse-picker" data-uilab-component="ShoppingForm.ReuseSheet" data-uilab-id="shopping-reuse-sheet"><input aria-label="以前の買い物を検索" placeholder="検索" value={query} onChange={(event) => setQuery(event.target.value)} /><div className="selection-list">{filteredItems.map((item) => <button type="button" className="reuse-result" key={item.id} onClick={() => selectItem(item)}><span>{item.name}</span><small>{item.quantity}</small></button>)}{filteredItems.length === 0 ? <p className="reuse-empty">見つかりませんでした</p> : null}</div></div>
      </BottomSheet>
      <BottomSheet open={sheet === 'delete'} title="買い物を削除しますか？" onClose={() => setSheet(null)}>
        <div className="delete-confirm" data-uilab-component="ShoppingForm.DeleteConfirm" data-uilab-id="shopping-delete-confirm"><p>この買い物を削除します。モック上の操作です。</p><button type="button" className="form-delete" onClick={() => { setSheet(null); setStatusMessage('削除しました'); }}>削除する</button><button type="button" className="form-secondary" onClick={() => setSheet(null)}>キャンセル</button></div>
      </BottomSheet>
    </div>
  );
}
