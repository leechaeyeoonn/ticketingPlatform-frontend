import { http, HttpResponse } from 'msw';
import { mockProducts } from '../data/productData';

let products = [...mockProducts];

export const productHandlers = [
  //조회
  http.get('/api/admin/productList', () => {
    return HttpResponse.json(products);
  }),

  //등록
  http.post('/api/admin/productList', async ({ request }) => {
    const newProductData = (await request.json()) as any;

    // 실제 DB처럼 새로운 ID를 생성해서 붙여줍니다.
    const createdProduct = {
      ...newProductData,
      id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
    };

    products.push(createdProduct); // 서버 데이터 업데이트
    console.log('새 상품 등록 완료:', createdProduct);

    return HttpResponse.json(createdProduct, { status: 201 });
  }),

  // 3. 수정 (PATCH)
  http.patch('/api/admin/productList/:id', async ({ params, request }) => {
    const { id } = params;
    const updatedData = (await request.json()) as any;

    // 해당 ID의 상품을 찾아 데이터를 덮어씌웁니다.
    products = products.map((p) => (p.id === Number(id) ? { ...p, ...updatedData } : p));

    const updatedProduct = products.find((p) => p.id === Number(id));
    console.log(`ID ${id} 상품 수정 완료`);

    return HttpResponse.json(updatedProduct, { status: 200 });
  }),

  // 삭제
  http.delete('/api/admin/productList/:id', ({ params }) => {
    const { id } = params;
    products = products.filter((p) => p.id !== Number(id));
    return new HttpResponse(null, { status: 204 });
  }),
];
