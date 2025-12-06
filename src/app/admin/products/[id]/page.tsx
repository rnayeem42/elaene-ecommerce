// src/app/admin/products/[id]/page.tsx
import ProductForm, {
  type ProductFormValues,
} from "@/components/admin/ProductForm";
import { connectToDatabase } from "@/libs/mongodb";
import Product from "@/models/products";
import { notFound } from "next/navigation";

type Params = {
  params: { id: string };
};

async function getProduct(id: string): Promise<ProductFormValues | null> {
  await connectToDatabase();
  // @ts-ignore
  const doc = await Product.findById(id).lean();
  if (!doc) return null;

  return {
    _id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description ?? "",
    price: Number(doc.price ?? 0),
    imageUrl: doc.imageUrl ?? "",
    category: doc.category ?? "",
    inStock: Boolean(doc.inStock ?? true),
  };
}

export async function generateMetadata({ params }: Params) {
  return {
    title: `Edit Product | Elaene Admin`,
  };
}

export default async function EditProductPage({ params }: Params) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Edit product</h2>
        <p className="text-sm text-slate-500">
          Update product information, price and stock.
        </p>
      </div>

      <ProductForm initialValues={product} />
    </div>
  );
}
