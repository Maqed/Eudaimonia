import { Skeleton } from "@/components/ui/skeleton";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

function CarouselWithCards() {
    return (
        <Carousel>
            <CarouselContent>
                <CarouselItem>
                    <Skeleton className="w-[400px] h-[228px]" />
                </CarouselItem>
                <CarouselItem>
                    <Skeleton className="w-[400px] h-[228px]" />
                </CarouselItem>
                <CarouselItem>
                    <Skeleton className="w-[400px] h-[228px]" />
                </CarouselItem>
                <CarouselItem>
                    <Skeleton className="w-[400px] h-[228px]" />
                </CarouselItem>
                <CarouselItem>
                    <Skeleton className="w-[400px] h-[228px]" />
                </CarouselItem>
            </CarouselContent>
        </Carousel>
    )
}

export default CarouselWithCards