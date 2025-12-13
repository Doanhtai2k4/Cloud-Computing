import React, { useState } from 'react';
import { message } from 'antd';
import { 
    FacebookOutlined, 
    TwitterOutlined,
    WhatsAppOutlined,
    LinkOutlined,
    ShareAltOutlined,
    CheckCircleFilled 
} from '@ant-design/icons';
import styles from './ShareButtons.module.css';

const ShareButtons = ({ url, title, description }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const shareUrl = url || window.location.href;
    const shareTitle = encodeURIComponent(title || document.title);
    const shareDescription = encodeURIComponent(description || '');

    const handleFacebookShare = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
    };

    const handleTwitterShare = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareTitle}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    };

    const handleWhatsAppShare = () => {
        const whatsappUrl = `https://wa.me/?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 2000);
        } catch (error) {
            message.error('Không thể copy link');
        }
    };

    return (
        <div className={styles.shareContainer}>
            {showToast && (
                <div className={styles.toast}>
                    <CheckCircleFilled className={styles.toastIcon} />
                    <span>Copy link thành công!</span>
                    <div className={styles.progressBar}></div>
                </div>
            )}
            <button 
                className={styles.shareButton}
                onClick={() => setIsOpen(!isOpen)}
            >
                <ShareAltOutlined /> Chia sẻ
            </button>

            {isOpen && (
                <div className={styles.shareButtons}>
                    <button 
                        className={`${styles.socialButton} ${styles.facebook}`}
                        onClick={handleFacebookShare}
                        title="Chia sẻ lên Facebook"
                    >
                        <FacebookOutlined />
                    </button>

                    <button 
                        className={`${styles.socialButton} ${styles.twitter}`}
                        onClick={handleTwitterShare}
                        title="Chia sẻ lên Twitter"
                    >
                        <TwitterOutlined />
                    </button>

                    <button 
                        className={`${styles.socialButton} ${styles.whatsapp}`}
                        onClick={handleWhatsAppShare}
                        title="Chia sẻ qua WhatsApp"
                    >
                        <WhatsAppOutlined />
                    </button>

                    <button 
                        className={`${styles.socialButton} ${styles.copy}`}
                        onClick={handleCopyLink}
                        title="Copy link"
                    >
                        <LinkOutlined />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ShareButtons;
