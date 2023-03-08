import React from 'react'

//Components
import { Swiper, SwiperSlide } from 'swiper/react'
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap'
import { Play, DollarSign, HelpCircle, FileText, Archive } from 'react-feather'
import BlankLayout from '../../../../@core/layouts/BlankLayout'

const index = () => {

    return (
        <BlankLayout>
            <Card className='bg-transparent shadow-none'>
                <CardHeader>
                    <CardTitle tag='h4'>Seleccione Plataforma</CardTitle>
                </CardHeader>
                <CardBody>
                    <Swiper dir={isRtl ? 'rtl' : 'ltr'} {...params}>
                    <SwiperSlide className='rounded swiper-shadow'>
                        <Play size={28} />
                        <p className='swiper-text align-middle pt-md-1 pt-sm-50 mb-0'>Getting Started</p>
                    </SwiperSlide>
                    <SwiperSlide className='rounded swiper-shadow'>
                        <DollarSign size={28} />
                        <p className='swiper-text align-middle pt-md-1 pt-sm-50 mb-0'>Pricing & Plans</p>
                    </SwiperSlide>
                    <SwiperSlide className='rounded swiper-shadow'>
                        <HelpCircle size={28} />
                        <p className='swiper-text align-middle pt-md-1 pt-sm-50 mb-0'>Sales Questions</p>
                    </SwiperSlide>
                    <SwiperSlide className='rounded swiper-shadow'>
                        <FileText size={28} />
                        <p className='swiper-text align-middle pt-md-1 pt-sm-50 mb-0'>User Guides</p>
                    </SwiperSlide>
                    <SwiperSlide className='rounded swiper-shadow'>
                        <Archive size={28} />
                        <p className='swiper-text align-middle pt-md-1 pt-sm-50 mb-0'>General Guides</p>
                    </SwiperSlide>
                    </Swiper>
                </CardBody>
            </Card>
        </BlankLayout>
    )
}
export default index

