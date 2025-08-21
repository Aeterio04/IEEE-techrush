# # donations/models.py
# from django.db import models
# from django.conf import settings
# from utils.moderation import moderate_image, moderate_text
# import os

# class Donation(models.Model):
#     title = models.CharField(max_length=255)
#     description = models.TextField()
#     image = models.ImageField(upload_to='donations/')
#     status = models.CharField(max_length=20, default="pending")  # pending, approved, rejected

#     def save(self, *args, **kwargs):
#         print(f"[DEBUG] save() called for donation: {self.title}")

#         # Run text moderation
#         text_result = moderate_text(f"{self.title} {self.description}")
#         if text_result and "unsafe" in str(text_result).lower():
#             self.status = "rejected"
#             print("[DEBUG] Text moderation flagged as unsafe.")
#             super().save(*args, **kwargs)
#             return

#         # Run image moderation if image exists
#         if self.image:
#             image_path = os.path.join(settings.MEDIA_ROOT, self.image.name)
#             if os.path.exists(image_path):
#                 image_result = moderate_image(image_path)
#                 if image_result and "unsafe" in str(image_result).lower():
#                     self.status = "rejected"
#                     print("[DEBUG] Image moderation flagged as unsafe.")
#                     super().save(*args, **kwargs)
#                     return
#             else:
#                 print(f"[ERROR] Image path not found: {image_path}")

#         # If both pass, approve
#         self.status = "approved"
#         super().save(*args, **kwargs)