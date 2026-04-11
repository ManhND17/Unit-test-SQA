import {
  EAppointmentStatus,
  EAppointmentType,
  EArticleStatus,
  EInvoiceStatus,
  EPaymentStatus,
  EVisitServiceStatus,
  EVisitStatus,
} from '@src/types';

export const mapAppointmentStatus = (status: EAppointmentStatus) => {
  switch (status) {
    case EAppointmentStatus.PENDING:
      return {
        label: 'Chờ xác nhận',
        variant: 'warning' as const,
      };
    case EAppointmentStatus.CONFIRMED:
      return {
        label: 'Đã xác nhận',
        variant: 'success' as const,
      };
    case EAppointmentStatus.CANCELLED:
      return {
        label: 'Đã hủy',
        variant: 'error' as const,
      };
    case EAppointmentStatus.COMPLETED:
      return {
        label: 'Đã hoàn thành',
        variant: 'info' as const,
      };
    case EAppointmentStatus.REJECTED:
      return {
        label: 'Đã từ chối',
        variant: 'error' as const,
      };
    default:
      return {
        label: 'Không xác định',
        variant: 'default' as const,
      };
  }
};

export const mapAppointmentType = (type: EAppointmentType) => {
  switch (type) {
    case EAppointmentType.NEW:
      return {
        label: 'Lịch mới',
        variant: 'success' as const,
      };
    case EAppointmentType.FOLLOW_UP:
      return {
        label: 'Lịch tái khám',
        variant: 'info' as const,
      };
    default:
      return {
        label: 'Không xác định',
        variant: 'default' as const,
      };
  }
};

export const mapVisitStatus = (status: EVisitStatus) => {
  switch (status) {
    case EVisitStatus.WAITING:
      return {
        label: 'Đang đợi',
        variant: 'warning' as const,
      };
    case EVisitStatus.IN_PROGRESS:
      return {
        label: 'Đang khám',
        variant: 'info' as const,
      };
    case EVisitStatus.COMPLETED:
      return {
        label: 'Đã hoàn thành',
        variant: 'success' as const,
      };
    case EVisitStatus.CANCELLED:
      return {
        label: 'Đã hủy',
        variant: 'error' as const,
      };
    default:
      return {
        label: 'Không xác định',
        variant: 'default' as const,
      };
  }
};

export const mapVisitServiceStatus = (status?: EVisitServiceStatus) => {
  switch (status) {
    case EVisitServiceStatus.ORDERED:
      return {
        label: 'Đã đặt',
        variant: 'warning' as const,
      };
    case EVisitServiceStatus.IN_PROGRESS:
      return {
        label: 'Đang thực hiện',
        variant: 'info' as const,
      };
    case EVisitServiceStatus.DONE:
      return {
        label: 'Đã thực hiện',
        variant: 'success' as const,
      };
    case EVisitServiceStatus.CANCELLED:
      return {
        label: 'Đã hủy',
        variant: 'error' as const,
      };
    default:
      return {
        label: 'Không xác định',
        variant: 'default' as const,
      };
  }
};

export const mapPaymentStatus = (status?: EPaymentStatus) => {
  switch (status) {
    case EPaymentStatus.PENDING:
      return {
        label: 'Đang chờ',
        variant: 'warning' as const,
      };
    case EPaymentStatus.PROCESSING:
      return {
        label: 'Đang xử lý',
        variant: 'info' as const,
      };
    case EPaymentStatus.COMPLETED:
      return {
        label: 'Đã thanh toán',
        variant: 'success' as const,
      };
    case EPaymentStatus.FAILED:
      return {
        label: 'Thất bại',
        variant: 'error' as const,
      };
    case EPaymentStatus.REFUNDED:
      return {
        label: 'Đã hoàn tiền',
        variant: 'info' as const,
      };
    default:
      return {
        label: 'Chưa thanh toán',
        variant: 'warning' as const,
      };
  }
};

export const mapInvoiceStatus = (status?: EInvoiceStatus) => {
  switch (status) {
    case EInvoiceStatus.PAID:
      return {
        label: 'Đã thanh toán',
        variant: 'success' as const,
      };
    case EInvoiceStatus.PENDING:
      return {
        label: 'Chờ thanh toán',
        variant: 'warning' as const,
      };
    case EInvoiceStatus.CANCELLED:
      return {
        label: 'Đã hủy',
        variant: 'error' as const,
      };
    default:
      return {
        label: 'Chưa xác định',
        variant: 'default' as const,
      };
  }
};

export const mapArticleStatus = (status?: EArticleStatus) => {
  switch (status) {
    case EArticleStatus.PUBLISHED:
      return {
        label: 'Đã xuất bản',
        variant: 'success' as const,
      };
    case EArticleStatus.DRAFT:
      return {
        label: 'Biên soạn',
        variant: 'warning' as const,
      };
    case EArticleStatus.PENDING_REVIEW:
      return {
        label: 'Đang chờ duyệt',
        variant: 'info' as const,
      };
    case EArticleStatus.REJECTED:
      return {
        label: 'Bị từ chối',
        variant: 'error' as const,
      };
    case EArticleStatus.REEDITED:
      return {
        label: 'Chỉnh sửa lại',
        variant: 'warning' as const,
      };
    default:
      return {
        label: 'Không xác định',
        variant: 'default' as const,
      };
  }
};
