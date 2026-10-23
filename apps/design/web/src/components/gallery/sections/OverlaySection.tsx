"use client";

import { AlertDialog, Button } from "@cocrepo/ui";
import { GalleryExample, GallerySection } from "../GallerySection";

export default function OverlaySection() {
	return (
		<GallerySection
			id="overlay"
			title="오버레이"
			description="확인이 필요한 파괴적 동작과 안내 대화상자입니다."
		>
			<GalleryExample label="AlertDialog">
				<AlertDialog>
					<AlertDialog.Trigger>
						<Button variant="danger">삭제 확인 대화상자 열기</Button>
					</AlertDialog.Trigger>
					<AlertDialog.Backdrop>
						<AlertDialog.Container>
							<AlertDialog.Dialog>
								<AlertDialog.Header>
									<AlertDialog.Icon status="danger" />
									<AlertDialog.Heading>
										북마크를 삭제할까요?
									</AlertDialog.Heading>
								</AlertDialog.Header>
								<AlertDialog.Body>
									삭제한 북마크는 복구할 수 없습니다. 계속하려면 삭제를
									눌러주세요.
								</AlertDialog.Body>
								<AlertDialog.Footer>
									<AlertDialog.CloseTrigger>
										<Button variant="outline">취소</Button>
									</AlertDialog.CloseTrigger>
									<AlertDialog.CloseTrigger>
										<Button variant="danger">삭제</Button>
									</AlertDialog.CloseTrigger>
								</AlertDialog.Footer>
							</AlertDialog.Dialog>
						</AlertDialog.Container>
					</AlertDialog.Backdrop>
				</AlertDialog>
				<AlertDialog>
					<AlertDialog.Trigger>
						<Button variant="primary">안내 대화상자 열기</Button>
					</AlertDialog.Trigger>
					<AlertDialog.Backdrop>
						<AlertDialog.Container>
							<AlertDialog.Dialog>
								<AlertDialog.Header>
									<AlertDialog.Icon status="accent" />
									<AlertDialog.Heading>
										새 큐레이션 반영 안내
									</AlertDialog.Heading>
								</AlertDialog.Header>
								<AlertDialog.Body>
									확인을 누르면 링크 목록이 최신 큐레이션으로 갱신됩니다.
								</AlertDialog.Body>
								<AlertDialog.Footer>
									<AlertDialog.CloseTrigger>
										<Button variant="primary">확인</Button>
									</AlertDialog.CloseTrigger>
								</AlertDialog.Footer>
							</AlertDialog.Dialog>
						</AlertDialog.Container>
					</AlertDialog.Backdrop>
				</AlertDialog>
			</GalleryExample>
		</GallerySection>
	);
}
