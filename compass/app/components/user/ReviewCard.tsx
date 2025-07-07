import { Card, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import RatedStars from './RatedStars';

type ReviewProps = {
  author: string;
  rating: number;
  review_body: string;
  time?: string; 
};
//we could have used predifined fun ,but i am getting some error with that

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [30, 'day'],
    [12, 'month'],
    [Number.POSITIVE_INFINITY, 'year'],
  ];

  let unit: Intl.RelativeTimeFormatUnit = 'second';
  let value = diffInSeconds;
  for (const [threshold, nextUnit] of intervals) {
    if (value < threshold) break;
    value = Math.floor(value / threshold);
    unit = nextUnit;
  }

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  return rtf.format(-value, unit); 
}

export default function ReviewCard({
  author,
  rating,
  review_body,
  time,
}: ReviewProps) {
  return (
    <Card className="mx-3 my-3 py-0 gap-0 bg-gray-50">
      <div className="mx-4 py-3">
        <div className='flex items-center justify-between mb-2'>
        <CardTitle className="text-lg text-black py-1 my-0">{author}</CardTitle>
        {time && (
          <p className="text-xs text-gray-500 italic mb-1">
            {formatTimeAgo(time)}
          </p>
        )}</div>
        <div className="flex items-center mb-3 text-black">
          <RatedStars
            count={5}
            rating={rating}
            iconSize={12}
            icon={''}
            color={'yellow'}
          />
          <p className="mx-2 font-light text-xs">({rating}/5)</p>
        </div>
        <Separator />
        <p className="my-3 text-black">{review_body}</p>
      </div>
    </Card>
  );
}
