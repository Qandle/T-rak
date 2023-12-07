'use client';
import Inputbutton from '../inputComponent/inputbtn';
import { CustomizeButton } from '../inputComponent/button';
import Link from 'next/link';
import Inputtypefile from '../inputTypeFile';
import { useState, useEffect } from 'react';
import Category from '@/app/(authentication)/tierlist/editDetail/[tierListId]/category';
import axfetch from '@/utils/axfetch';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function TierListDetailEdit({ tierListId }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fetchTierListData = () =>
    axfetch.get(`api/tierlist/show/?id=${tierListId}`).then((res) => res.data);
  const { data, error, isLoading, isSuccess } = useQuery({
    queryKey: ['tierListData', tierListId],
    queryFn: fetchTierListData,
  });
  const [tierlistDetails, setTierListDetails] = useState(data);

  useEffect(() => {
    setTierListDetails(data);
  }, [data]);

  return (
    <div className='flex gap-7 px-2'>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData();
          formData.append('tierlistId', tierListId);
          Object.entries(tierlistDetails).forEach(([key, value]) => {
            formData.append(key, value);
          });
          const res = await fetch(`/api/tierlist/update`, {
            method: 'POST',
            body: formData,
          }).then(() => {
            queryClient.invalidateQueries({ queryKey: ['tierListData'] });
            queryClient.invalidateQueries({ queryKey: ['fetchTierListCards'] });
            const Toast = Swal.mixin({
              timer: 1500,
              showConfirmButton: false,
              text: 'Going back to home',
            });
            Toast.fire({
              icon: 'success',
              title: 'Edit successfully',
            }).then(() => {
              router.push(`/home`);
            });
          });
        }}
        className='flex w-full flex-col gap-5'
      >
        <Inputbutton
          text='Tierlist Name'
          type='text'
          name='name'
          defaultValue={tierlistDetails?.name || ''}
          handleInputChange={(e) => {
            setTierListDetails({
              ...tierlistDetails,
              ['name']: e.target.value,
            });
          }}
        />
        <Inputtypefile
          read={1}
          className=' h-[90px] w-[90px]'
          text='Edit Cover Photo'
          name='CoverPhoto'
          param={
            !tierlistDetails?.coverPhoto
              ? isSuccess &&
                process.env.NEXT_PUBLIC_SUPABASE_URL +
                  '/storage/v1/object/public/images/' +
                  tierlistDetails?.coverPhotoUrl
              : tierlistDetails.coverPhotoUrl
          }
          handleChange={(e) => {
            if (!e.target.files[0]) {
              return;
            }
            setTierListDetails({
              ...tierlistDetails,
              ['coverPhoto']: e.target.files[0],
              ['coverPhotoUrl']: URL.createObjectURL(e.target.files[0]),
            });
          }}
        />
        <Category
          defaultValue={tierlistDetails?.category?.categoryName || ''}
          handleCombobox={(e) => {
            setTierListDetails({
              ...tierlistDetails,
              ['categoryName']: e.target.value,
            });
          }}
        />
        <Inputbutton
          text='Description'
          name='description'
          isArea={1}
          defaultValue={tierlistDetails?.description || ''}
          handleInputChange={(e) => {
            setTierListDetails({
              ...tierlistDetails,
              ['description']: e.target.value,
            });
          }}
        />
        <div className='flex justify-between gap-[18px] pt-4 '>
          <div className='basis-1/3'>
            <Link href={'/home'} className='w-full'>
              <CustomizeButton text='Cancel' styles='btncherry' />
            </Link>
          </div>
          <div className='basis-2/3'>
            <CustomizeButton text='Save' styles='btnpeach' btType='submit' />
          </div>
        </div>
      </form>
    </div>
  );
}
