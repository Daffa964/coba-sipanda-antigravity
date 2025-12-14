import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  redirect(`/posyandu/${id}`)
}
