'use client';
import Header from './header';
import { useState, useEffect } from 'react';
import { data } from '../data';
import dynamic from 'next/dynamic';
import MenuBar from '@/app/components/menuComponent/menuBar';

const RowDragable = dynamic(() => import('@/app/components/rowDragable'), {
  ssr: false,
});

export default function EditExpand({ params }) {
  // items = [chosenRow, spawnerRow(a row that has Id = -1)]
  const [items, setItems] = useState([
    {
      id: params.rowId,
      label: 'some label',
      deletedElements: [],
      elements: [
        {
          id: '1',
          title: 'Anime You1',
          toShowSrc: '/vercel.svg',
        },
        {
          id: '2',
          title: 'Anime You2',
          toShowSrc: '/vercel.svg',
        },
        {
          id: '3',
          title: 'Anime You3',
          toShowSrc: '/vercel.svg',
        },
        {
          id: '4',
          title: 'Anime You4',
          toShowSrc: '/vercel.svg',
        },
        {
          id: '5',
          title: 'Anime You5',
          toShowSrc: '/vercel.svg',
        },
        {
          id: '6',
          title: 'Anime You6',
          toShowSrc: '/vercel.svg',
        },
        {
          id: '7',
          title: 'Anime You7',
          toShowSrc: '/vercel.svg',
        },
        {
          id: '8',
          title: 'Anime You8',
          toShowSrc: '/vercel.svg',
        },
        {
          id: '9',
          title: 'Anime You9',
          toShowSrc: '/vercel.svg',
        },
        {
          id: '10',
          title: 'Anime You10',
          toShowSrc: '/vercel.svg',
        },
      ],
    },
    data[data.length - 1],
  ]);
  const [tempItems, setTempItems] = useState(items);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    console.log(items);
  }, [items]);

  return (
    <div className='relative flex h-screen w-full flex-col overflow-hidden'>
      <Header
        isEditable={isEditable}
        setIsEditable={setIsEditable}
        setTempItems={setTempItems}
        resetItems={() => {
          setTempItems(items);
        }}
        saveItems={() => {
          setItems(tempItems);
        }}
        tierListId={params.tierListId}
        rowId={params.rowId}
        data={tempItems}
      />
      <div className='relative h-[78%] shrink-0 grow-0  rounded-t-[20px] bg-cream'>
        <div
          className={` transition-[height] ${
            isEditable ? 'h-[100%]' : 'h-[85%]'
          } w-full touch-auto snap-y overflow-y-auto scroll-auto`}
        >
          <RowDragable
            items={tempItems}
            setItems={setTempItems}
            isEditable={isEditable}
          />
        </div>
        <div
          className={`absolute inset-x-0 bottom-5 flex h-1/6 shrink-0 justify-center ${
            isEditable && 'hidden'
          }`}
        >
          <MenuBar type={'home'} />
        </div>
      </div>
    </div>
  );
}
