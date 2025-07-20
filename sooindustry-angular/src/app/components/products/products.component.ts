import { Component } from '@angular/core';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
    standalone: false
})
export class ProductsComponent {
    // 이미지 모달 관련 프로퍼티
    isModalOpen = false;
    modalImage = '';
    modalTitle = '';

    constructor() {}

    // 이미지 모달 열기
    openImageModal(imageSrc: string, title: string): void {
        this.modalImage = imageSrc;
        this.modalTitle = title;
        this.isModalOpen = true;
        // 배경 스크롤 방지
        document.body.style.overflow = 'hidden';
    }

    // 이미지 모달 닫기
    closeImageModal(): void {
        this.isModalOpen = false;
        this.modalImage = '';
        this.modalTitle = '';
        // 배경 스크롤 복원
        document.body.style.overflow = 'auto';
    }
}
